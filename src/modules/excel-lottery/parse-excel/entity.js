class Student {
    constructor(id, name, group) {
        this.id = id;
        this.name = name;
        this.group = group;
    }

    static toString(student) {
        return `${student.id}: ${student.name}`;
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

module.exports = {
    Student,
    Group
}