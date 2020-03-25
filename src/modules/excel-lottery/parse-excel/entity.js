const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];


class Student {
    constructor(id, name, group) {
        this.id = id;
        this.name = name;
        this.group = group;
        this.color = colors[Math.round(Math.random() * colors.length)]
    }

    static create({ id, name, group }) {
        return new Student(id, name, group);
    }

    static toString(student) {
        return student.name;
    }

    static toFullString(student) {
        return `学号:${student.id}  组:${Group.toString(student.group)}`;
    }
}

class Group {
    constructor(name, number, raw) {
        this.name = name;
        this.number = number;
        this.raw = raw;
    }

    static toString(group) {
        return group.name;
    }
}

// module.exports = {
//     Student,
//     Group,
//     colors
// }

export {
    Student,
    Group,
    colors
}