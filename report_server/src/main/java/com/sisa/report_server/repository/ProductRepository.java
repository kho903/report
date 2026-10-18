package com.sisa.report_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sisa.report_server.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
