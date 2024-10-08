package beans;

import entities.AkeelOrder;
import entities.Runner;
import entities.User;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Stateless
@Path("/runner")
@Produces("application/json")
@Consumes("application/json")
public class RunnerBean {

    @PersistenceContext
    EntityManager em;
    private Runner runner;

    @POST
    @Path("/login")
    public Runner login(Runner runner) {
        Query query = em.createQuery("SELECT u FROM User u WHERE u.username='" + runner.getUsername() + "' AND u.password='" + runner.getPassword() + "'");
        if (query.getResultList().isEmpty())
            return null;
        else {
            Runner loggedInUser = (Runner) query.getSingleResult();
            if (loggedInUser.getRole().equals(User.UserRole.RUNNER)){
                this.runner = loggedInUser;
                return loggedInUser;
            }
            else
                return null;
        }
    }

    @POST
    @Path("/signup")
    public Object signup(Runner runner) {
        runner.setStatus(Runner.RunnerStatus.AVAILABLE);
        runner.setRole(User.UserRole.RUNNER);
        runner.setNumberOfTrips(0);
        try {
            em.persist(runner);
        } catch (Exception e) {
            JsonObject json = Json.createObjectBuilder().add("message", "This user already exists").build();
            return Response.status(Response.Status.UNAUTHORIZED).entity(json).build();
        }
        return runner;
    }

    @POST
    @Path("/complete/{id}")
    public Object completeOrder(@PathParam("id") long id) {
        AkeelOrder order = em.find(AkeelOrder.class, id);
        if (order.getOrderStatus().equals(AkeelOrder.OrderStatus.CANCELED)){
            JsonObject json = Json.createObjectBuilder().add("message", "Order is cancelled").build();
            return Response.status(Response.Status.CONFLICT).entity(json).build();
        }
        order.setOrderStatus(AkeelOrder.OrderStatus.DELIVERED);
        this.runner.setStatus(Runner.RunnerStatus.AVAILABLE);
        this.runner.setNumberOfTrips(this.runner.getNumberOfTrips()+1);
        em.merge(order);
        em.merge(this.runner);
        return Json.createObjectBuilder().add("message", "Order completed successfully").build();
    }

    @GET
    @Path("/trips/{id}")
    public int getTrips(@PathParam("id") long id) {
        Runner runner1 = em.find(Runner.class, id);
        return runner1.getNumberOfTrips();
    }

    @GET
    @Path("/getRunnerOrder/{id}")
    public List<AkeelOrder> getRunnerOrders(@PathParam("id") long id) {
        //get all orders
        //get order with runner id
        List<AkeelOrder> runnerOrders = em.createQuery("SELECT o FROM AkeelOrder o WHERE o.runner.id = " + id).getResultList();
        return runnerOrders;
    }
}
