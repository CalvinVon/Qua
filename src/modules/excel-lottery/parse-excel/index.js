const isDev = process.env.DEBUG === "true";
const _require = isDev ? require : window.require;

const Excel = _require('exceljs');
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

/**
 * 确保排除 表格头 等信息，拿到真实的第一列数据
 */
function getActualRowBegin(column) {
    let i
    for (i = 1; i <= column.values.length; i++) {
        const value = column.values[i];
        if (value.includes('表')) {
            continue;
        }
        else {
            break;
        }
    }
    return i;
}


function sortColumns(workSheet) {
    let rowBegin;
    const keys = [
        { label: '学号', value: 'id' },
        { label: '姓名', value: 'name' },
        { label: '组', value: 'group' },
    ];
    const includes = {};
    const others = [];
    const columnsCount = workSheet.actualColumnCount;

    for (let index = 1; index <= columnsCount; index++) {
        const column = workSheet.getColumn(index);
        const header = column.values[rowBegin || (rowBegin = getActualRowBegin(column))] || '';

        let matched;
        for (let i = 0; i < keys.length; i++) {
            const { label, value } = keys[i];
            if (header.includes(label)) {
                includes[value] = {
                    header,
                    column,
                    values: column.values,
                };
                matched = true;
            }
        }


        if (!matched) {
            others.push({
                header,
                column,
                values: column.values
            });
        }
    }

    return { includes, others };
}

async function parser(filePath) {
    await workBook.xlsx.readFile(filePath);
    const workSheet = getFirstWorkSheet(workBook);

    const { includes, others } = sortColumns(workSheet);

    const firstCol = workSheet.getColumn(1);
    const students = [];

    firstCol.eachCell((cell, rowNumber) => {
        const id = includes.id.values[rowNumber] || '';
        
        if (/^[\dA-Z]+$/i.test(id)) {
            const name = includes.name.values[rowNumber];
            const fields = others.filter(it => it.values[rowNumber]).map(it => ({ name: it.header || '缺省', value: it.values[rowNumber] || '' }));
            students.push(new Student(id, name, fields));
        }

    });

    return students;
}

if (isDev) {
    parser(process.env.EXCEL_SRC);
}

export default parser;