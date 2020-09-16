module.exports = {
    //此项是用来告诉eslint找当前配置文件不能往父级查找
    root: true,
    parserOptions: {
        //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
        parser: 'babel-eslint',
    },
    // 此项指定环境的全局变量，下面的配置指定为浏览器环境
    env: {
        browser: true,
    },
    extends: ['plugin:vue/strongly-recommended', '@vue/standard'],
    plugins: ['vue'],
    // add your custom rules here 0-off 1-warn 2-error
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        'no-undef': 0,
        // // 代码后使用内联注释
        // 'no-inline-comments': 0,
        // 'multiline-comment-style': 0,
        'no-mixed-operators': 0,
        'no-dupe-args': 2, // 函数参数不能重复
        'no-dupe-keys': 1, // 在创建对象字面量时不允许键重复 {a:1,a:1}
        'no-duplicate-case': 2, // switch中的case标签不能重复  
        // 稀疏数组
        'no-sparse-arrays': 0,
        // 空函数
        'no-empty-function': 0,
        // 禁止不必要的分号
        'no-extra-semi': 2,
        // // function的左括号之前可以不使用空格
        'space-before-function-paren': [0, 'always'],
        // 允许对象{后，}前有空格
        'standard/object-curly-even-spacing': [2, 'either'],
        // 允许数组[后，]前有空格
        'standard/array-bracket-even-spacing': [2, 'either'],
        'camelcase': 0,//驼峰命名
        // // 检测对象文字中的尾随逗号。因此，只要遇到对象字面上的尾随逗号，就会发出警告。
        'no-comma-dangle': 0,
        'comma-dangle': 0,
        'no-unreachable': 0, //在return，throw，continue，break语句后不允许出现不可能到达的语句
        'eqeqeq': 0, // 必须使用全等
        'no-useless-escape': 0,
        'standard/no-callback-literal': 0,
        "generator-star-spacing": "off",
        "no-mixed-operators": 0,
        "no-unused-expressions": 0,
        "no-sequences": 0,
        "indent": [
            2,
            2,
            {
                SwitchCase: 1
            }
        ], //缩进风格
        'no-mixed-spaces-and-tabs': 0, //允许混用tab和空格
        // 'no-multi-spaces': 2, //不能用多余的空格
        'no-multiple-empty-lines': [ //空行最多不能超过1行
            2,
            {
                max: 1
            }
        ],
        // 'no-unexpected-multiline': 2, //避免多行表达式
        // 'no-whitespace-before-property': 2, // 禁止属性前有空白
        // 'space-before-blocks': [2, 'always'], //不以新行开始的块{前面要不要有空格
        // 'object-curly-spacing': [ //大括号内是否允许不必要的空格
        //     2,
        //     'always',
        //     {
        //         objectsInObjects: false
        //     }
        // ],
        'array-bracket-spacing': [2, 'never'], //是否允许非空数组里面有多余的空格

        "vue/max-attributes-per-line": [
            2,
            {
                "singleline": 5,
                "multiline": {
                    "max": 1,
                    "allowFirstLine": false
                }
            }
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        "vue/attribute-hyphenation": 0,
        "vue/html-self-closing": 0,
        "vue/component-name-in-template-casing": 0,
        "vue/html-closing-bracket-spacing": 0,
        "vue/singleline-html-element-content-newline": 0,
        "vue/no-unused-components": 0,
        "vue/multiline-html-element-content-newline": 0,
        "vue/no-use-v-if-with-v-for": 0,
        "vue/html-closing-bracket-newline": 0,
        "vue/no-parsing-error": 0,
        "vue/no-unused-vars": 0,
        "vue/valid-v-for": 1,
        "vue/no-dupe-keys": 1,
        "vue/require-v-for-key": 1,
        " vue/use-v-on-exact": 0,
        "vue/return-in-computed-property": 0,
        "vue/no-side-effects-in-computed-properties": 0,
        "vue/require-default-prop": 0,
        "no-console": 0,
        "no-tabs": 0,
        "quotes": [
            2,
            "single",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            2,
            "never",
            {
                "beforeStatementContinuationChars": "never"
            }
        ],
        "no-delete-var": 2,
        "prefer-const": [
            2,
            {
                "ignoreReadBeforeAssign": false
            }
        ]

    },
    overrides: [{
        files: [
            '**/__tests__/*.{j,t}s?(x)',
            '**/tests/unit/**/*.spec.{j,t}s?(x)'
        ],
        env: {
            jest: true
        }
    }]

}