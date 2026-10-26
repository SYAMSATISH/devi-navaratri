package devi.service;

import devi.entity.User;
import devi.exception.ResourceNotFoundException;
import devi.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // CREATE MEMBER
    public User createUser(User user) {

        long memberCount = userRepository.findAll()
                .stream()
                .filter(u -> "MEMBER".equals(u.getRole()))
                .count();

        if (memberCount >= 10) {
            throw new IllegalArgumentException("Maximum 10 members are allowed");
        }

        ensureEmailFree(user.getEmail(), null);

        user.setRole("MEMBER");

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new BadCredentialsException("Invalid email or password");
        }

        return user;
    }

    // UPDATE USER
    public User updateUser(
            Long id,
            User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        ensureEmailFree(updatedUser.getEmail(), id);

        existingUser.setName(
                updatedUser.getName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }

        return userRepository.save(existingUser);
    }

    // DELETE USER
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        userRepository.delete(user);
    }

    // RESET PASSWORD
    public void resetPassword(
            Long id,
            String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);
    }

    // GET ALL MEMBERS
    public List<User> getMembers() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        "MEMBER".equals(user.getRole()))
                .toList();
    }

    // GET ALL ADMINS
    public List<User> getAdmins() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        "ADMIN".equals(user.getRole()))
                .toList();
    }

    // CREATE ADMIN
    public User createAdmin(User user) {

        ensureEmailFree(user.getEmail(), null);

        user.setRole("ADMIN");

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // CHANGE USER ROLE
    public User changeRole(
            Long id,
            String role) {

        if (!role.equals("ADMIN")
                && !role.equals("MEMBER")) {

            throw new IllegalArgumentException("Role must be ADMIN or MEMBER");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // If changing to MEMBER,
        // check maximum 10 members
        if ("MEMBER".equals(role)
                && !"MEMBER".equals(user.getRole())) {

            long memberCount = userRepository.findAll()
                    .stream()
                    .filter(u ->
                            "MEMBER".equals(u.getRole()))
                    .count();

            if (memberCount >= 10) {
                throw new IllegalArgumentException("Maximum 10 members are allowed");
            }
        }

        if ("ADMIN".equals(user.getRole())
                && "MEMBER".equals(role)
                && getAdmins().size() <= 1) {

            throw new IllegalArgumentException(
                    "At least one admin is required"
            );
        }

        user.setRole(role);

        return userRepository.save(user);
    }

    private void ensureEmailFree(String email, Long selfId) {

        userRepository.findByEmail(email).ifPresent(found -> {
            if (selfId == null || !found.getId().equals(selfId)) {
                throw new IllegalArgumentException(
                        "Email is already registered"
                );
            }
        });
    }
}