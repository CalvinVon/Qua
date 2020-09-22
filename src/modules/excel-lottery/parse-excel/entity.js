const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];


class Student {
    constructor(name, fields) {
        this.uuid = Math.random().toString(16).substr(2) + Date.now();
        this.name = name;
        this.fields = fields;
        this.color = colors[Math.round(Math.random() * colors.length)]
    }

    static create({ name, fields }) {
        return new Student(name, fields);
    }

    static toString(student) {
        return student.name;
    }

    static toFullString(student) {
        return `姓名：${student.name}；${student.fields.map(it => `${it.name}：${it.value}`).join('；')}`;
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