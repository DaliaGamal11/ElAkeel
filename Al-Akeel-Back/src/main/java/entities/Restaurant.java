package entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Collection;

@Entity
public class Restaurant implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String name;

    private long ownerId;

    @OneToMany(mappedBy = "restaurant", fetch = FetchType.EAGER, orphanRemoval = true)
    private Collection<Meal> meals;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(long ownerId) {
        this.ownerId = ownerId;
    }

    public Collection<Meal> getMeals() {
        return meals;
    }

    public void setMeals(Collection<Meal> meals) {
        this.meals = meals;
    }

    public void addMeal (Meal meal) { this.meals.add(meal); }

    public void removeMeal (Meal meal) { this.meals.remove(meal); }
}
