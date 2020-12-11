package com.example.post.service;

import java.nio.charset.StandardCharsets;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import com.example.post.model.Mail;

@Service
public class EmailSenderService {

    private JavaMailSender javaMailSender;

    private SpringTemplateEngine templateEngine;

    public EmailSenderService(JavaMailSender javaMailSender, SpringTemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendEmail(Mail mail, String template) throws MessagingException {
        MimeMessage message = getMimeMessage(mail, template);
        javaMailSender.send(message);
    }

    private MimeMessage getMimeMessage(Mail mail, String template) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = // https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/mail/javamail/MimeMessageHelper.html
                new MimeMessageHelper(
                        message,
                        MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                        StandardCharsets.UTF_8.name());

        Context context = new Context();
        context.setVariables(mail.getModel());
        String html = templateEngine.process(template, context);

        helper.setTo(mail.getTo());
        if(mail.getReplyTo() != null) {
            helper.setReplyTo(mail.getReplyTo());
        }
        if(mail.getCc() != null) {
            helper.setCc(mail.getCc());
        }
        if(mail.getBcc() != null) {
            helper.setBcc(mail.getBcc());
        }
        helper.setText(html, true);
        helper.setSubject(mail.getSubject());
        helper.setFrom(mail.getFrom());
        return message;
    }
}
