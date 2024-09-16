package beans;

import entities.*;
import jakarta.ejb.Stateless;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Stateless
@Path("/customer")
@Produces("application/json")
@Consumes("application/json")
public class CustomerBean {
    @PersistenceContext
    EntityManager em;

    private User customer = null;

    @POST
    @Path("/login")
    public User login(User customer) {
        Query query = em.createQuery("SELECT u FROM User u WHERE u.username='" + customer.getUsername() + "' AND u.password='" + customer.getPassword() + "'");
        if (query.getResultList().isEmpty())
            return null;
        else {
            User loggedInUser = (User) query.getSingleResult();
            if (loggedInUser.getRole().equals(User.UserRole.CUSTOMER)){
                this.customer = loggedInUser;
                return loggedInUser;
            }
            else
                return null;
        }
    }

    @POST
    @Path("/signup")
    public Object signup(User customer) {
        customer.setRole(User.UserRole.CUSTOMER);
        try {
            em.persist(customer);
        } catch (Exception e) {
            JsonObject json = Json.createObjectBuilder().add("message", "This user already exists").build();
            return Response.status(Response.Status.UNAUTHORIZED).entity(json).build();
        }
        return customer;
    }

    @POST
    @Path("/order")
    public Object createOrder(List<Meal> meals) {

        Query query;
        query = em.createQuery("SELECT c FROM Runner c WHERE c.status='" + Runner.RunnerStatus.AVAILABLE + "' ");
        if (query.getResultList().isEmpty()) {
            JsonObject json = Json.createObjectBuilder().add("message", "No runners available").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        AkeelOrder order = new AkeelOrder();
        em.persist(order);
        String restaurantName = null;
        ArrayList<Meal> mealList = new ArrayList<>();
        double price = 0;
        if (meals == null || meals.isEmpty()) {
            JsonObject json = Json.createObjectBuilder().add("message", "please add some meals").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        for (Meal meal: meals) {
            Meal meal1;
            try {
                meal1 = em.find(Meal.class, meal.getId());
            } catch (Exception e) {
                JsonObject json = Json.createObjectBuilder().add("message", "Meal couldn't be found").build();
                return Response.status(Response.Status.CONFLICT).entity(json).build();
            }
            price += meal1.getPrice();
            meal1.setAkeelOrder(order);
            mealList.add(meal1);
            em.merge(meal1);
        }
        restaurantName = mealList.get(0).getRestaurant().getName();
        for (Meal meal:mealList) {
            if(meal.getRestaurant().getName() != restaurantName) {
                JsonObject json = Json.createObjectBuilder().add("message", "meals are not from the same restaurant").build();
                return Response.status(Response.Status.CONFLICT).entity(json).build();
            }
        }
        order.setItems(mealList);
        query = em.createQuery("SELECT c FROM Restaurant c WHERE c.name='" + restaurantName + "'");
        Restaurant restaurant = (Restaurant) query.getSingleResult();
        order.setRestaurant(restaurant);
        order.setCustomerId(this.customer.getId());
        query = em.createQuery("SELECT c FROM Runner c WHERE c.status='" + Runner.RunnerStatus.AVAILABLE + "' ");
        if (query.getResultList().isEmpty()) {
            JsonObject json = Json.createObjectBuilder().add("message", "No runners available").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        List<Runner> runners = query.getResultList();
        Random rand = new Random();
        int randomIndex = rand.nextInt(runners.size());
        Runner runner = runners.get(randomIndex);
        runner.setStatus(Runner.RunnerStatus.BUSY);
        em.merge(runner);
        order.setDeliveryFee(runner.getDeliveryFees());
        price += runner.getDeliveryFees();
        order.setRunner(runners.get(randomIndex));
        order.setTotalPrice(price);
        order.setOrderStatus(AkeelOrder.OrderStatus.PREPARING);
        LocalDate date = LocalDate.now();
        order.setDate(date.toString());
        em.merge(order);
        return order;
    }

    @GET
    @Path("/order/{id}")
    public List<AkeelOrder> getOrderById(@PathParam("id") long id) {
        Query query = em.createQuery("SELECT c FROM AkeelOrder c WHERE c.customerId=" + id);
        if (query.getResultList().isEmpty()) {
            return null;
        }
        return (List<AkeelOrder>) query.getResultList();

    }

    @PUT
    @Path("/edit-order/{id}")
    public Object editOrder(@PathParam("id") long id, List<Meal> meals) {
        AkeelOrder order = em.find(AkeelOrder.class, id);
        double price = 0;

        if (order == null) {
            JsonObject json = Json.createObjectBuilder().add("message", "order not found").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        if (!order.getOrderStatus().equals(AkeelOrder.OrderStatus.PREPARING)) {
            JsonObject json = Json.createObjectBuilder().add("message", "order is not being currently prepared").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        for (Meal meal: order.getItems()) {
            meal.setAkeelOrder(null);
            price += meal.getPrice();
            em.merge(meal);
        }
        order.setItems(null);
        em.merge(order);
        ArrayList<Meal> mealList = new ArrayList<>();
        if (meals != null) {
            order.setTotalPrice(order.getTotalPrice() - price);
            price = 0;
            for (Meal meal : meals) {
                Meal meal1;
                try {
                    meal1 = em.find(Meal.class, meal.getId());
                    price += meal1.getPrice();
                } catch (Exception e) {
                    JsonObject json = Json.createObjectBuilder().add("message", "Meal couldn't be found").build();
                    return Response.status(Response.Status.CONFLICT).entity(json).build();
                }
                meal1.setAkeelOrder(order);
                order.setTotalPrice(order.getTotalPrice() + price);

                mealList.add(meal1);
                em.merge(meal1);
            }
            order.setItems(mealList);
        } else {
            JsonObject json = Json.createObjectBuilder().add("message", "No items added").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        em.merge(order);
        return Json.createObjectBuilder().add("message", "Order edited successfully").build();
    }

    @PUT
    @Path("/cancel-order/{id}")
    public Object cancelOrder(@PathParam("id") long id) {
        AkeelOrder order = em.find(AkeelOrder.class, id);
        order.setOrderStatus(AkeelOrder.OrderStatus.CANCELED);
        em.merge(order);
        return Json.createObjectBuilder().add("message", "Order cancelled successfully").build();
    }

    @GET
    @Path("/restaurants")
    public List<Restaurant> getAllRestaurants() {
        Query query = em.createQuery("SELECT u FROM Restaurant u");
        return query.getResultList();
    }

    @GET
    @Path("/meals/{id}")
    public List<Meal> getAllMealsByRest(@PathParam("id") long id) {
        Query query = em.createQuery("SELECT u FROM Meal u WHERE u.restaurant=" + id);
        return query.getResultList();
    }
}
