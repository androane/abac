#!/usr/bin/env bash
prefix="eve/"

files=""

for file in ${@:2}; do
    if (grep -Fxq "${file}" ./mypy/ignored-files.txt) && [[ "${1}" == "--include" ]] ; then
            files+=" ${file#"$prefix"}"
    elif !(grep -Fxq "${file}" ./mypy/ignored-files.txt) && [[ "${1}" == "--exclude" ]]; then
            files+=" ${file#"$prefix"}"
    fi
done

echo $files
