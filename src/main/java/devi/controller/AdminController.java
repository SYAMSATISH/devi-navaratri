package devi.controller;

import devi.dto.UserResponse;
import devi.entity.User;
import devi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    // GET ALL MEMBERS
    @GetMapping("/members")
    public ResponseEntity<List<UserResponse>> getMembers() {

        List<UserResponse> members = userService.getMembers()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(members);
    }

    // GET MEMBER BY ID
    @GetMapping("/members/{id}")
    public ResponseEntity<UserResponse> getMember(
            @PathVariable Long id) {

        User user = userService.getUserById(id);

        if (!"MEMBER".equals(user.getRole())) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toResponse(user));
    }

    // CREATE MEMBER
    @PostMapping("/members")
    public ResponseEntity<UserResponse> createMember(
            @RequestBody User user) {

        User savedUser = userService.createUser(user);

        return new ResponseEntity<>(
                toResponse(savedUser),
                HttpStatus.CREATED
        );
    }
    // CREATE ADMIN
@PostMapping("/admins")
public ResponseEntity<UserResponse> createAdmin(
        @RequestBody User user) {

    User savedAdmin = userService.createAdmin(user);

    return new ResponseEntity<>(
            toResponse(savedAdmin),
            HttpStatus.CREATED
    );
}

    // UPDATE MEMBER
    @PutMapping("/members/{id}")
    public ResponseEntity<UserResponse> updateMember(
            @PathVariable Long id,
            @RequestBody User user) {

        User existingUser = userService.getUserById(id);

        if (!"MEMBER".equals(existingUser.getRole())) {
            return ResponseEntity.notFound().build();
        }

        User updatedUser =
                userService.updateUser(id, user);

        return ResponseEntity.ok(
                toResponse(updatedUser)
        );
    }

    // DELETE MEMBER
    @DeleteMapping("/members/{id}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long id) {

        User existingUser = userService.getUserById(id);

        if (!"MEMBER".equals(existingUser.getRole())) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    // CHANGE USER ROLE
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> changeRole(
            @PathVariable Long id,
            @RequestParam String role) {

        User updatedUser =
                userService.changeRole(id, role.toUpperCase());

        return ResponseEntity.ok(
                toResponse(updatedUser)
        );
    }

    // GET ALL ADMINS
    @GetMapping("/admins")
    public ResponseEntity<List<UserResponse>> getAdmins() {

        List<UserResponse> admins = userService.getAdmins()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(admins);
    }

    // CONVERT USER TO RESPONSE
    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}