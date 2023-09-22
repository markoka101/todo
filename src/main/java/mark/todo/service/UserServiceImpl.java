package mark.todo.service;


import lombok.AllArgsConstructor;
import mark.todo.entity.Role;
import mark.todo.entity.User;
import mark.todo.pojo.Task;
import mark.todo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return unwrapUser(user,id);
    }

    @Override
    public User getUser(String nameOrEmail, String option) {
        Optional<User> user;
        if(option.equals("username")) {
            user = userRepository.findByUsername(nameOrEmail);
        } else {
            user = userRepository.findByEmail(nameOrEmail);
        }
        return unwrapUser(user, 404L);
    }

    //saves user when register
    @Override
    public void saveUser(User user) {
        //encode user password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        //set user role
        user.addRole(new Role(2L));
        userRepository.save(user);
    }

    /*
    Task functions
     */
    @Override
    public void createTask(Long id, Task task) {
        User user = getUser(id);
        task.setTaskNumber(user.getTasks().size() + 1);
        user.getTasks().add(task);
        userRepository.save(user);
    }

    @Override
    public void finishTask(Long id, int taskNumber, Boolean complete) {
        User user = getUser(id);
        getTask(user,taskNumber).setComplete(true);
        userRepository.save(user);
    }

    @Override
    public void editTask(Long id, int taskNumber, Task updatedTask) {
        User user = getUser(id);
        Task currTask = getTask(user,taskNumber);

        currTask.setTaskDesc(updatedTask.getTaskDesc());
        currTask.setDate(updatedTask.getDate());

        userRepository.save(user);
    }

    //display tasks
    @Override
    public Set<Task> allTasks(Long id) {
        User user = getUser(id);
        return user.getTasks();
    }

    //delete tasks
    @Override
    public void deleteTask(Long id, int taskNumber) {

    }

    //return specific task from set
    private Task getTask(User user, int taskNumber) {
        for (Task task : user.getTasks()) {
            if (task.getTaskNumber() == taskNumber) {
                return task;
            }
        }
        return null;
    }

    static User unwrapUser(Optional<User> entity, Long id) {
        if (entity.isPresent()) {
            return entity.get();
        }
        else {
            throw new EntityNotFoundException("User not found");
        }
    }
}
