"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.getUniqueId = exports.removeFromArray = exports.deepExtendValue = exports.deepExtend = exports.extend = exports.ensureElementPositionAbsolute = exports.setElementDisplayVisibility = exports.getElementWidthAndHeight = exports.setElementHeight = exports.getElementHeight = exports.setElementWidth = exports.getElementWidth = exports.isDigit = exports.splitStringAtFirstNonNumericChar = exports.pixelsToNumber = exports.numberToPixels = void 0;
/** @internal */
function numberToPixels(value) {
    return value.toString(10) + 'px';
}
exports.numberToPixels = numberToPixels;
/** @internal */
function pixelsToNumber(value) {
    const numberStr = value.replace("px", "");
    return parseFloat(numberStr);
}
exports.pixelsToNumber = pixelsToNumber;
/** @internal */
function splitStringAtFirstNonNumericChar(value) {
    if (typeof value !== 'string') {
        // 非字符串时打 warn 并返回空结果，让上层走"无效数字"路径（parseSize 会抛 ConfigurationError），
        // 而不是直接 TypeError 中断整个布局。
        // 常见诱因：后端下发的 config.size 字段缺失或类型不对（例如 number 而非 string、字段为 undefined）。
        console.warn('[golden-layout] splitStringAtFirstNonNumericChar expected string, got', value === undefined ? 'undefined' : typeof value, value);
        return { numericPart: '', firstNonNumericCharPart: '' };
    }
    value = value.trimStart();
    const length = value.length;
    if (length === 0) {
        return { numericPart: '', firstNonNumericCharPart: '' };
    }
    else {
        let firstNonDigitPartIndex = length;
        let gotDecimalPoint = false;
        for (let i = 0; i < length; i++) {
            const char = value[i];
            if (!isDigit(char)) {
                if (char !== '.') {
                    firstNonDigitPartIndex = i;
                    break;
                }
                else {
                    if (gotDecimalPoint) {
                        firstNonDigitPartIndex = i;
                        break;
                    }
                    else {
                        gotDecimalPoint = true;
                    }
                }
            }
        }
        const digitsPart = value.substring(0, firstNonDigitPartIndex);
        const firstNonDigitPart = value.substring(firstNonDigitPartIndex).trim();
        return { numericPart: digitsPart, firstNonNumericCharPart: firstNonDigitPart };
    }
}
exports.splitStringAtFirstNonNumericChar = splitStringAtFirstNonNumericChar;
/** @internal */
function isDigit(char) {
    return char >= '0' && char <= '9';
}
exports.isDigit = isDigit;
/** @internal */
function getElementWidth(element) {
    return element.offsetWidth;
}
exports.getElementWidth = getElementWidth;
/** @internal */
function setElementWidth(element, width) {
    const widthAsPixels = numberToPixels(width);
    element.style.width = widthAsPixels;
}
exports.setElementWidth = setElementWidth;
/** @internal */
function getElementHeight(element) {
    return element.offsetHeight;
}
exports.getElementHeight = getElementHeight;
/** @internal */
function setElementHeight(element, height) {
    const heightAsPixels = numberToPixels(height);
    element.style.height = heightAsPixels;
}
exports.setElementHeight = setElementHeight;
/** @internal */
function getElementWidthAndHeight(element) {
    return {
        width: element.offsetWidth,
        height: element.offsetHeight,
    };
}
exports.getElementWidthAndHeight = getElementWidthAndHeight;
/** @internal */
function setElementDisplayVisibility(element, visible) {
    // 用 className 标志可见性，并用 off-screen 定位替代 style.display='none'。
    // 原因：Chromium 合成器在 display:none 的 iframe + WebGL canvas 路径上会死锁，
    // 导致切 tab 时整个 tab 卡死（参考 F:/vite-project/排查记录-viser-iframe-display-none-卡死.md）。
    // 通过把元素移到屏外并停用交互，绕开 Chromium 的 display:none 处理路径。
    element.classList.toggle('gl-hidden', !visible);
    if (visible) {
        element.style.removeProperty('position');
        element.style.removeProperty('left');
        element.style.removeProperty('top');
        element.style.removeProperty('pointer-events');
        element.style.removeProperty('visibility');
    }
    else {
        element.style.position = 'absolute';
        element.style.left = '-99999px';
        element.style.top = '-99999px';
        element.style.pointerEvents = 'none';
        element.style.visibility = 'hidden';
    }
}
exports.setElementDisplayVisibility = setElementDisplayVisibility;
/** @internal */
function ensureElementPositionAbsolute(element) {
    const absolutePosition = 'absolute';
    if (element.style.position !== absolutePosition) {
        element.style.position = absolutePosition;
    }
}
exports.ensureElementPositionAbsolute = ensureElementPositionAbsolute;
/**
 * Replacement for JQuery $.extend(target, obj)
 * @internal
*/
function extend(target, obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            target[key] = obj[key];
        }
    }
    return target;
}
exports.extend = extend;
/**
 * Replacement for JQuery $.extend(true, target, obj)
 * @internal
*/
function deepExtend(target, obj) {
    if (obj !== undefined) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const existingTarget = target[key];
                target[key] = deepExtendValue(existingTarget, value);
            }
        }
    }
    return target;
}
exports.deepExtend = deepExtend;
/** @internal */
function deepExtendValue(existingTarget, value) {
    if (typeof value !== 'object') {
        return value;
    }
    else {
        if (Array.isArray(value)) {
            const length = value.length;
            const targetArray = new Array(length);
            for (let i = 0; i < length; i++) {
                const element = value[i];
                targetArray[i] = deepExtendValue({}, element);
            }
            return targetArray;
        }
        else {
            if (value === null) {
                return null;
            }
            else {
                const valueObj = value;
                if (existingTarget === undefined) {
                    return deepExtend({}, valueObj); // overwrite
                }
                else {
                    if (typeof existingTarget !== "object") {
                        return deepExtend({}, valueObj); // overwrite
                    }
                    else {
                        if (Array.isArray(existingTarget)) {
                            return deepExtend({}, valueObj); // overwrite
                        }
                        else {
                            if (existingTarget === null) {
                                return deepExtend({}, valueObj); // overwrite
                            }
                            else {
                                const existingTargetObj = existingTarget;
                                return deepExtend(existingTargetObj, valueObj); // merge
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.deepExtendValue = deepExtendValue;
/** @internal */
function removeFromArray(item, array) {
    const index = array.indexOf(item);
    if (index === -1) {
        throw new Error('Can\'t remove item from array. Item is not in the array');
    }
    array.splice(index, 1);
}
exports.removeFromArray = removeFromArray;
/** @internal */
function getUniqueId() {
    return (Math.random() * 1000000000000000)
        .toString(36)
        .replace('.', '');
}
exports.getUniqueId = getUniqueId;
/** @internal */
function getErrorMessage(e) {
    if (e instanceof Error) {
        return e.message;
    }
    else {
        if (typeof e === 'string') {
            return e;
        }
        else {
            return 'Unknown Error';
        }
    }
}
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=utils.js.map