export default function (conditions: any, groundTruth: any, enableBehavior: string ) {
    let conditions_arr = [];
    console.log("Parsing enableWhen conditions:", conditions);
    conditions.forEach(element => {
        let condition = {
            question: groundTruth[element.question],
            operator: element.operator,
            answer: element.answerBoolean ?? element.answerDecimal ?? element.answerInteger ?? element.answerString ?? element.answerDate ?? element.answerTime ?? element.answerCoding.code ?? element.answerCoding.display ?? null
        };
        conditions_arr.push(evaluateCondition(condition));
    });
    console.log("conditions:", conditions_arr);

    if (enableBehavior === 'all') {
        const allTrue = conditions_arr.every(val => val === true);
        console.log("All conditions met:", allTrue);
        return allTrue;
    } else if (enableBehavior === 'any') {
        const anyTrue = conditions_arr.some(val => val === true);
        console.log("Any condition met:", anyTrue);
        return anyTrue;
    }
}

const evaluateCondition = (condition: any) => {
    const actualValue = condition.question;
    const targetValue = condition.answer;
    const operator = condition.operator;

    // Handle Case: Source question is a multi-select (Array)
    if (Array.isArray(actualValue)) {
        if (operator === '=') return actualValue.includes(targetValue);
        if (operator === '!=') return !actualValue.includes(targetValue);
    }

    // Handle Case: Standard single values
    switch (operator) {
        case '=': return actualValue === targetValue;
        case '!=': return actualValue !== targetValue;
        case '>': return actualValue > targetValue;
        case '<': return actualValue < targetValue;
        case 'exists':
            const hasValue = actualValue !== '' && actualValue !== null && actualValue !== undefined;
            return targetValue ? hasValue : !hasValue;
        default: return false;
    }
}