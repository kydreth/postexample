package com.example.post.model;

import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Mail {
    private String from;
    private String replyTo;
    private String to;
    private String bcc;
    private String cc;
    private String subject;
    private Map<String, Object> model;
}
