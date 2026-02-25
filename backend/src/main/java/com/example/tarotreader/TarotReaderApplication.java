package com.example.tarotreader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * 塔罗牌解读应用程序入口类。
 * @author dehua
 */
@SpringBootApplication
@EnableConfigurationProperties
public class TarotReaderApplication {

    public static void main(String[] args) {
        SpringApplication.run(TarotReaderApplication.class, args);
    }

}
