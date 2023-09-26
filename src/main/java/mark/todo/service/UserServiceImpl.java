package mark.todo.service;


import lombok.AllArgsConstructor;
import mark.todo.entity.Role;
import mark.todo.entity.User;
import mark.todo.pojo.Task;
import mark.todo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import java.util.*;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private EntityManager entityManager;

    //gets user through id
    @Override
    public User getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return unwrapUser(user,id);
    }

    //gets user through username or email
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
    //create task
    @Override
    public void createTask(Long id, Task task) {
        User user = getUser(id);
        task.setTaskNumber(user.getTasks().size() + 1);
        user.getTasks().add(task);
        userRepository.save(user);
    }

    //set task to complete
    @Override
    public void finishTask(Long id, int taskNumber, Boolean complete) {
        User user = getUser(id);
        getTask(user,taskNumber).setComplete(true);
        userRepository.save(user);
    }

    //edit the task's date or description
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

        //using treeset so I can sort the tasks when displaying
        Set<Task> treeSet = new TreeSet<>(Comparator.comparing(Task::getTaskNumber));
        treeSet.addAll(user.getTasks());
        return treeSet;
    }

    //delete tasks
    @Override
    public void deleteTask(Long id, int taskNumber) {
        User user = getUser(id);

        //using iterator to avoid concurrent modification exception
        Iterator<Task> iterTask = user.getTasks().iterator();
        while(iterTask.hasNext()) {
            Task task = iterTask.next();
            if (task.getTaskNumber() == taskNumber) {
                iterTask.remove();
            }
            if(task.getTaskNumber() > taskNumber) {
                task.setTaskNumber(task.getTaskNumber() - 1);
            }
        }
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
