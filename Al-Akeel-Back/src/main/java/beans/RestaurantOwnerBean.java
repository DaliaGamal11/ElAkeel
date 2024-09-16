package beans;

import entities.AkeelOrder;
import entities.Meal;
import entities.Restaurant;
import entities.User;
import jakarta.ejb.Stateless;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Stateless
@Path("/restaurant")
@Produces("application/json")
@Consumes("application/json")
public class RestaurantOwnerBean {

    @PersistenceContext
    EntityManager em;

    private User owner = null;
    private Restaurant restaurant = null;

    // login providing username and password in a json object
    @POST
    @Path("/login")
    public User login(User owner) {
        this.restaurant = null;
        Query query = em.createQuery("SELECT u FROM User u WHERE u.username='" + owner.getUsername() + "' AND u.password='" + owner.getPassword() + "'");
        if (query.getResultList().isEmpty())
            return null;
        else {
            User loggedInUser = (User) query.getSingleResult();
            if (loggedInUser.getRole().equals(User.UserRole.RESTAURANT_OWNER)){
                this.owner = loggedInUser;
                return loggedInUser;
            }
            else
                return null;
        }
    }

    // signup providing username, password and name in a json object
    @POST
    @Path("/signup")
    public Object signup(User owner) {
        owner.setRole(User.UserRole.RESTAURANT_OWNER);
        try {
            em.persist(owner);
        } catch (Exception e) {
            JsonObject json = Json.createObjectBuilder().add("message", "This user already exists").build();
            return Response.status(Response.Status.UNAUTHORIZED).entity(json).build();
        }
        return owner;
    }

    // add meal to restaurant for frontend
    @POST
    @Path("/add-meal")
    public Object addMealToRest(Meal meal) {
        try {
            meal.setRestaurant(this.restaurant);
            this.restaurant.addMeal(meal);
            em.merge(meal);
        } catch (Exception e) {
            JsonObject json = Json.createObjectBuilder().add("message", "meal already exists").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        return Json.createObjectBuilder().add("message", "Meal added successfully").build();
    }

    // remove meal from restaurant for frontend
    @DELETE
    @Path("/remove-meal/{id}")
    public Object removeMealFromRest(@PathParam("id") long id) {
        Meal meal = em.find(Meal.class, id);
        if (meal == null) {
            JsonObject json = Json.createObjectBuilder().add("message", "meal not found").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        this.restaurant.getMeals().remove(meal);
        this.restaurant.setMeals(this.restaurant.getMeals());
        em.remove(meal);
        return Json.createObjectBuilder().add("message", "Meal removed successfully").build();
    }

    // create a restaurant entity in the db by providing the name in a json object
    @POST
    @Path("/create")
    public Object createRestaurant(Restaurant restaurant) {
        if (this.restaurant != null) {
            JsonObject json = Json.createObjectBuilder().add("message", "restaurant was created previously").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        restaurant.setOwnerId(owner.getId());
        restaurant.setMeals(new ArrayList<>());
        try {
            em.persist(restaurant);
        } catch (Exception e) {
            JsonObject json = Json.createObjectBuilder().add("message", "This restaurant already exists").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        this.restaurant = restaurant;
        return restaurant;
    }

    // create menu of the previously created restaurant by providing an array of meals in json
    @POST
    @Path("/menu")
    public Object createRestaurantMenu(List<Meal> meals) {
        if (this.restaurant == null) {
            JsonObject json = Json.createObjectBuilder().add("message", "restaurant not created").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        if (!this.restaurant.getMeals().isEmpty()) {
            JsonObject json = Json.createObjectBuilder().add("message", "menu was created previously").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        for (Meal meal:meals) {
            meal.setRestaurant(this.restaurant);
            try {
                em.persist(meal);
            } catch (Exception e) {
                JsonObject json = Json.createObjectBuilder().add("message", "Can't add more than one object with the same name").build();
                return Response.status(Response.Status.CONFLICT).entity(json).build();
            }
        }
        this.restaurant.setMeals(meals);
        return Json.createObjectBuilder().add("message", "menu created successfully").build();
    }

    // edit restaurant menu by giving an array of meals that replace the original meals
    @PUT
    @Path("/edit")
    public Object editRestaurant(List<Meal> meals) {
        if (this.restaurant == null) {
            JsonObject json = Json.createObjectBuilder().add("message", "restaurant not created").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        for (Meal meal: this.restaurant.getMeals()) {
            this.removeMealFromRest(meal.getId());
        }
        if(meals != null) {
            for (Meal meal : meals) {
                this.addMealToRest(meal);
            }
        } else {
            JsonObject json = Json.createObjectBuilder().add("message", "You should create a menu first").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        return Json.createObjectBuilder().add("message", "Restaurant edited successfully").build();
    }

    // get a restaurant by id
    @GET
    @Path("/get-restaurant/{id}")
    public Restaurant getRestaurantById(@PathParam("id") int id) {
        Query query = em.createQuery("SELECT c FROM Restaurant c WHERE c.id=" + id);
        if (query.getResultList().isEmpty())
            return null;
        return (Restaurant) query.getSingleResult();
    }

    // generate a report for the restaurant of the given id
    @GET
    @Path("/report/{id}")
    public Object createReport(@PathParam("id") int id) {
        Query query = em.createQuery("SELECT c FROM AkeelOrder c WHERE c.restaurant=" + id);
        if (query.getResultList().isEmpty()) {
            return "Restaurant does not exist";
        }
        List<AkeelOrder> orders = query.getResultList();
        Query query1 = em.createQuery("SELECT c FROM Restaurant c WHERE c.id=" + id);
        Restaurant restaurant = (Restaurant) query1.getSingleResult();
        String restaurantName = restaurant.getName();

        double sum = 0;
        int completed = 0;
        int canceled = 0;
        for (int i=0; i<orders.size(); i++) {
            if (orders.get(i).getOrderStatus().equals(AkeelOrder.OrderStatus.DELIVERED)) {
                sum += orders.get(i).getTotalPrice();
                completed += 1;
            }
            else if (orders.get(i).getOrderStatus().equals(AkeelOrder.OrderStatus.CANCELED)) {
                canceled += 1;
            }
        }
        return Json.createObjectBuilder()
                .add("Restaurant", restaurantName)
                .add("Total_earnings", sum)
                .add("Completed_orders", completed)
                .add("Canceled_orders", canceled)
                .build();
    }

    @PUT
    @Path("/cancel-order/{id}")
    public Object cancelOrder(@PathParam("id") long id) {
        AkeelOrder order = em.find(AkeelOrder.class, id);
        order.setOrderStatus(AkeelOrder.OrderStatus.CANCELED);
        em.merge(order);
        return Json.createObjectBuilder().add("message", "Order cancelled successfully").build();
    }
}