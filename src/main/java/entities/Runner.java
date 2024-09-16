package entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Runner extends User{

    public enum RunnerStatus {
        AVAILABLE,
        BUSY
    }

    @OneToOne
    private AkeelOrder akeelOrder;

    @Enumerated(EnumType.STRING)
    private RunnerStatus status;

    private double deliveryFees;

    private int numberOfTrips;

    public AkeelOrder getAkeelOrder() {
        return akeelOrder;
    }

    public void setAkeelOrder(AkeelOrder akeelOrder) {
        this.akeelOrder = akeelOrder;
    }

    public RunnerStatus getStatus() {
        return status;
    }

    public void setStatus(RunnerStatus status) {
        this.status = status;
    }

    public double getDeliveryFees() {
        return deliveryFees;
    }

    public void setDeliveryFees(double deliveryFees) {
        this.deliveryFees = deliveryFees;
    }

    public int getNumberOfTrips() {
        return numberOfTrips;
    }

    public void setNumberOfTrips(int numberOfTrips) {
        this.numberOfTrips = numberOfTrips;
    }
}

