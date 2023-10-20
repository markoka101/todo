package mark.todo.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.util.Date;

@Embeddable
@NoArgsConstructor
@Getter
@Setter
public class Task {
    private int taskNumber;
    private String taskDesc;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private Date date;
    private Boolean complete;

    public Task(String taskDesc, Date date, int taskNumber) {
        this.taskDesc = taskDesc;
        this.date = date;
        this.complete = false;
        this.taskNumber = taskNumber;
    }
}