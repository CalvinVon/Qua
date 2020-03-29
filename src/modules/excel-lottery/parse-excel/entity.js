const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];


class Student {
    constructor(name, group) {
        this.id = Math.random().toString(16).substr(2) + Date.now();
        this.name = name;
        this.group = group;
        this.color = colors[Math.round(Math.random() * colors.length)]
    }

    static create({ name, group }) {
        return new Student(name, group);
    }

    static toString(student) {
        return student.name;
    }

    static toFullString(student) {
        return `姓名：${student.name}  组：${student.group}`;
    }
}



// module.exports = {
//     Student,
//     Group,
//     colors
// }

export {
    Student,
    colors
}