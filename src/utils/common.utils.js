export default {
    /**
     * 数组去重
     * @param {Array} array 要去重的数组 （会被修改）
     * @param {String|Function} [fieldOrJudgeMethod] 去重特征字段或者特征函数
     */
    deduplication(array, fieldOrJudgeMethod) {
        const judgeMethod =
            typeof fieldOrJudgeMethod === 'function' ?
                fieldOrJudgeMethod :
                item => {
                    return item[fieldOrJudgeMethod] || item;
                };

        for (var i = 0; i < array.length; i++) {
            for (var j = i + 1; j < array.length; j++) {
                if (judgeMethod(array[i]) === judgeMethod(array[j])) {
                    array.splice(j, 1);
                    j--;
                }
            }
        }
        return [...array];
    }
}