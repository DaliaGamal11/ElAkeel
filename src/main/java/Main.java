import entities.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import org.hsqldb.error.Error;

public class Main {
    public static void main(String[] args) {
        User u = new User();
        u.setRole(User.UserRole.RUNNER);
        u.setName("Runner1");
        u.setUsername("runner");
        u.setPassword("123456");

        EntityManagerFactory factory = Persistence.createEntityManagerFactory("default");
        EntityManager em = factory.createEntityManager();

        em.getTransaction().begin();
        em.persist(u);
        Query q = em.createQuery("select c from User c where c.id=" + u.getId());
        User newuser = (User) q.getSingleResult();
        System.out.println(newuser.getId());
        System.out.println(newuser.getName());
        System.out.println(newuser.getRole());
        System.out.println(newuser.getUsername());
        System.out.println(newuser.getPassword());
        em.flush();
        em.getTransaction().commit();
        factory.close();
        em.close();
    }
}
