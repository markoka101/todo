package mark.todo.web;

import lombok.AllArgsConstructor;
import mark.todo.service.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

    UserService userService;
}
