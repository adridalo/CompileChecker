export const determineLanguage = file => {
    const extension = file.split('.').pop()
    let language = null

    switch(extension) {
        case 'c':
            language = 'C'
            break
        case 'cpp':
            language = 'CPP17'
            break
        case 'cs':
            language = 'CSHARP'
            break
        case 'go':
            language = 'GO'
            break
        case 'java':
            language = 'JAVA14'
            break
        case 'js':
            language = 'JAVASCRIPT_NODE'
            break
        case 'py':
            language = 'PYTHON3'
            break
        case 'r':
            language = 'R'
            break
        case 'ts':
            language = 'TYPESCRIPT'
            break
    }

    return language
}