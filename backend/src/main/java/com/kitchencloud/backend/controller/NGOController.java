package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.model.NGO;
import com.kitchencloud.backend.repository.NGORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
public class NGOController {

    @Autowired
    private NGORepository ngoRepository;

    @GetMapping
    public ResponseEntity<List<NGO>> getApprovedNGOs() {
        return ResponseEntity.ok(ngoRepository.findByApproved(true));
    }
}
