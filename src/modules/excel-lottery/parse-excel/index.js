const Excel = window.require('exceljs');
const workBook = new Excel.Workbook();

const { Student, Group } = require('./entity');

async function parser(filePath) {
    await workBook.xlsx.readFile(filePath);
    const workSheet = workBook.getWorksheet(1);

    workSheet.columns = [
        { header: '学号', key: 'id' },
        { header: '姓名', key: 'name' },
    ];

    const idCol = workSheet.getColumn('id');
    const nameCol = workSheet.getColumn('name');

    const students = [];
    let lastGroup;

    idCol.eachCell((cell, rowNumber) => {
        const value = '' + cell.value;
        let matched;
        if (matched = value.match(/^\s*(G(\d+))\s*$/)) {
            const name = matched[1];
            const number = Number(matched[2]);
            const raw = value;
            lastGroup = new Group(name, number, raw);
        }
        else if (matched = value.match(/^\s*(\d+)\s*$/)) {
            const id = matched[1];
            const name = nameCol.values[rowNumber];
            students.push(new Student(id, name, lastGroup));
        }
    });

    return students;
}

export default parser;