package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PortfolioMediaController {

    @PostMapping("/media/upload")
    public Map<String, String> uploadMedia(@RequestBody Map<String, String> payload) {
        String secureUrl = payload.getOrDefault("secureUrl", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3");
        String fileName = payload.getOrDefault("fileName", "portfolio-media");

        return Map.of(
            "fileName", fileName,
            "secureUrl", secureUrl,
            "source", "cloudinary-ready"
        );
    }
}
