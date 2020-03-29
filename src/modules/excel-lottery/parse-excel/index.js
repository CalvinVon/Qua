const Excel = window.require('exceljs');
const workBook = new Excel.Workbook();

const { Student } = require('./entity');

function getFirstWorkSheet(workBook) {
    const length = workBook.worksheets.length;
    let i = 0;
    while (i < length) {
        const sheet = workBook.worksheets[i];
        if (sheet) {
            return sheet;
        }
    }
    return null;
}

async function parser(filePath) {
    await workBook.xlsx.readFile(filePath);
    const workSheet = getFirstWorkSheet(workBook);

    workSheet.columns = [
        { header: '组别', key: 'group' },
        { header: '姓名', key: 'name' },
    ];

    const groupCol = workSheet.getColumn('group');
    const nameCol = workSheet.getColumn('name');

    const students = [];

    nameCol.eachCell((cell, rowNumber) => {
        const value = '' + cell.value;

        if (!value.match(/(组|姓名)/)) {
            const group = groupCol.values[rowNumber];
            const name = value;
            students.push(new Student(name, group));
        }
    });

    return students;
}

export default parser;