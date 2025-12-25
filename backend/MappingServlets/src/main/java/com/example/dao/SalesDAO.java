package com.example.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.example.util.MongoDBUtil;
import com.example.model.Sale;
import java.util.ArrayList;
import java.util.List;

public class SalesDAO {
    private final MongoCollection<Sale> salesCollection;

    public SalesDAO() {
        MongoDatabase db = MongoDBUtil.getDatabase();
        this.salesCollection = db.getCollection("sales", Sale.class);
    }

    // Gets a individual sale
    public void recordSale(Sale sale) {
        salesCollection.insertOne(sale);
    }

    // Return the total revenue of all products
    public double getTotalRevenue() {
        List<Sale> allSales = getAllSales();
        return allSales.stream().mapToDouble(Sale::getTotalAmount).sum();
    }

    public List<Sale> getAllSales() {
        List<Sale> allSales = new ArrayList<>();
        salesCollection.find().into(allSales);
        return allSales;
    }

    public List<Sale> getSalesByCompany(String company) {
        List<Sale> companySales = new ArrayList<>();
        salesCollection.find(com.mongodb.client.model.Filters.eq("company", company)).into(companySales);
        return companySales;
    }

    public double getRevenueByCompany(String company) {
        List<Sale> companySales = getSalesByCompany(company);
        return companySales.stream().mapToDouble(Sale::getTotalAmount).sum();
    }

    public List<Sale> getSalesByCustomerEmail(String email) {
        List<Sale> customerSales = new ArrayList<>();
        salesCollection.find(com.mongodb.client.model.Filters.eq("customerEmail", email)).into(customerSales);
        return customerSales;
    }
}