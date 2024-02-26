package com.example.notes.user;

import java.time.Instant;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

  @Autowired
  JwtEncoder encoder;

  @Autowired
  UserService userService;

  PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @PostMapping("/login")
  public ResponseEntity<Token> login(@Valid @RequestBody Credentials body) {
    Optional<User> optionalUser = userService.getUserByUsername(
        body.getUsername());
    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    User user = optionalUser.get();
    if (!passwordEncoder.matches(body.getPassword(), user.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Instant now = Instant.now();
    Instant expiration = now.plusSeconds(36000L);
    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuer("self")
        .issuedAt(now)
        .expiresAt(expiration)
        .subject(String.valueOf(user.getId()))
        .build();
    String tokenValue = this.encoder
        .encode(JwtEncoderParameters.from(claims))
        .getTokenValue();
    Token token = new Token();
    token.setExpiration(expiration.toString());
    token.setToken(tokenValue);
    return ResponseEntity.ok().body(token);
  }

  @PostMapping("/signup")
  public ResponseEntity<Void> signup(@Valid @RequestBody Credentials body) {
    Optional<User> optionalUser = userService.getUserByUsername(
        body.getUsername());
    if (optionalUser.isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    User user = new User();
    user.setUsername(body.getUsername());
    user.setPassword(passwordEncoder.encode(body.getPassword()));
    userService.createUser(user);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/changepassword")
  public ResponseEntity<Void> changePassword(
      @Valid @RequestBody PasswordChange body,
      Authentication authentication) {
    Long userId = Long.valueOf(authentication.getName());
    Optional<User> optionalUser = userService.getUserById(userId);
    if (optionalUser.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    User user = optionalUser.get();
    if (!passwordEncoder.matches(body.getOldPassword(), user.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    user.setPassword(passwordEncoder.encode(body.getNewPassword()));
    userService.updateUser(user);
    return ResponseEntity.ok().build();
  }
}
