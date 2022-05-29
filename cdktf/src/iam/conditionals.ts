export enum Operations {
    /*** Exact matching, case sensitive */
    StringEquals = "StringEquals",
    /*** Negated matching */
    StringNotEquals = "StringNotEquals",
    /*** Exact matching, ignoring case */
    StringEqualsIgnoreCase = "StringEqualsIgnoreCase",
    /*** Negated matching, ignoring case */
    StringNotEqualsIgnoreCase = "StringNotEqualsIgnoreCase",
    /*** Case-sensitive matching. The values can include multi-character match wildcards (*) and single-character match wildcards (?) anywhere in the string. note - If a key contains multiple values, StringLike can be qualified with set operators—ForAllValues:StringLike and ForAnyValue:StringLike. For more information, see Creating a condition with multiple keys or values. */
    StringLike = "StringLike",
    /*** Negated case-sensitive matching. The values can include multi-character match wildcards (*) or single-character match wildcards (?) anywhere in the string. */
    StringNotLike = "StringNotLike"
}

export default Operations;