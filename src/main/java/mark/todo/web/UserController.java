package mark.todo.web;

import lombok.AllArgsConstructor;
import mark.todo.entity.User;
import mark.todo.pojo.AuthRequest;
import mark.todo.pojo.AuthResponse;
import mark.todo.pojo.Task;
import mark.todo.security.JwtTokenUtil;
import mark.todo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.transaction.Transactional;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Set;


@AllArgsConstructor
@RestController
@CrossOrigin(
        origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
@RequestMapping("/user")
public class UserController {

    private UserService userService;
    private AuthenticationManager authenticationManager;
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping("/{id}")
    @RolesAllowed({"ROLE_ADMIN"})
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUser(id), HttpStatus.OK);
    }

    /*
    Signup and login
     */
    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthRequest request) {

        //authenticates user's credentials
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword())
            );

            User user = userService.getUser((String)authentication.getPrincipal(), "username");

            //generate token and send back
            String accessToken = jwtTokenUtil.generateAccessToken(user);
            AuthResponse response = new AuthResponse(user.getId(), request.getUsername(), accessToken);

            return ResponseEntity.accepted().body(response);
        } catch (BadCredentialsException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    /*
    Task controller methods
     */
    //adding task
    @PostMapping("/{id}/addTask")
    @RolesAllowed({"ROLE_ADMIN","ROLE_USER"})
    public ResponseEntity<?> addTask(@PathVariable Long id, @Valid @RequestBody Task task, Principal p) {
        if(!p.getName().toString().equals(userService.getUser(id).getUsername())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.createTask(id, task);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //display tasks
    @GetMapping("/{id}/getTasks")
    @RolesAllowed({"ROLE_ADMIN","ROLE_USER"})
    public ResponseEntity<Set<Task>> getTasks(@PathVariable Long id, Principal p) {
        if(!p.getName().toString().equals(userService.getUser(id).getUsername())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(userService.allTasks(id), HttpStatus.OK);
    }

    //display completed tasks
    @GetMapping("/{id}/completedTasks")
    @RolesAllowed({"ROLE_ADMIN","ROLE_USER"})
    public ResponseEntity<Set<Task>> getCompletedTasks(@PathVariable Long id, Principal p) {
        if(!p.getName().toString().equals(userService.getUser(id).getUsername())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(userService.finishedTasks(id), HttpStatus.OK);
    }

    //edit task
    @PutMapping("/{id}/{taskNumber}/edit")
    @RolesAllowed({"ROLE_ADMIN","ROLE_USER"})
    public ResponseEntity<?> editTask(@PathVariable Long id, @PathVariable int taskNumber, @Valid @RequestBody Task task, Principal p) {
        if(!p.getName().toString().equals(userService.getUser(id).getUsername())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.editTask(id,taskNumber,task);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //set task to complete
    @PutMapping("/{id}/{taskNumber}/completed")
    @RolesAllowed({"ROLE_ADMIN","ROLE_USER"})
    public ResponseEntity<?> finishTask(@PathVariable Long id, @PathVariable int taskNumber,Principal p) {
        if(!p.getName().toString().equals(userService.getUser(id).getUsername())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.finishTask(id,taskNumber,true);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //delete task
    @DeleteMapping("/{id}/{taskNumber}/delete")
    @RolesAllowed({"ROLE_ADMIN","ROLE_USER"})
    @Transactional
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @PathVariable int taskNumber,Principal p) {
        if(!p.getName().toString().equals(userService.getUser(id).getUsername())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.deleteTask(id, taskNumber);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
