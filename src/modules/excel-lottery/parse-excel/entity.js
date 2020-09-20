const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];


class Student {
    constructor(id, name, fields) {
        this.uuid = Math.random().toString(16).substr(2) + Date.now();
        this.id = id;
        this.name = name;
        this.fields = fields;
        this.color = colors[Math.round(Math.random() * colors.length)]
    }

    static create({ id, name, fields }) {
        return new Student(id, name, fields);
    }

    static toString(student) {
        return student.name;
    }

    static toFullString(student) {
        return `姓名：${student.name}；学号：${student.id}； ${student.fields.map(it => `${it.name}：${it.value}`).join('；')}`;
    }
}



// module.exports = {
//     Student,
//     colors
// }

export {
    Student,
    colors
}