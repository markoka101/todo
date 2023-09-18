package mark.todo.pojo;

import java.util.Date;

public class Task {
    private String taskDesc;
    private Date date;
    private Boolean complete;

    public Task(String taskDesc, Date date) {
        this.taskDesc = taskDesc;
        this.date = date;
        this.complete = false;
    }

    //Getters
    public String getTaskDesc() {
        return this.taskDesc;
    }
    public Date getDate() {
        return this.date;
    }
    public Boolean getComplete() {
        return this.complete;
    }

    //setters
    public void setTaskDesc(String taskDesc) {
        this.taskDesc = taskDesc;
    }
    public void setDate(Date date) {
        this.date = date;
    }
    public void setComplete(Boolean complete) {
        this.complete = complete;
    }
}
