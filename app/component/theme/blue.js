var blue = {
    root: {
        backgroundColor: '#1B4EA2',
        // backgroundImage: '-webkit-linear-gradient(top, transparent 40px, #14305C 42px),-webkit-linear-gradient(left, transparent 40px, #14305C 42px)',
        // backgroundSize: '42px 42px'
    },
    title: {
        padding: '16px 16px 0 16px',
        backgroundColor: 'linear-gradient(to right, #6b73fd, #b195ff)',
        borderWidth: 0,
        borderColor: '#114591',
    },
    layout: {
        // padding: '10px 0 0 10px'
    },
    items: {
        background: '#04204A', // 需要关联更改converter中的getThemeColor
        // border: '1px solid #055CB6',
        border: 'none',
        // boxShadow: 'inset 0 0 20px 0 rgba(79,166,255,0.62)',
        config: {
            margin: [16, 16]
        }
    },
    table: {
        config: {
            head: {
                textAlign: 'center',
                background: 'rgb(30, 76, 190)',
                border: 'none'
                // borderWidth: '0.5px',
                // borderStyle: 'solid',
                // borderColor: '#6589BB'
            },
            stripeRows: ['#253C7E', '#182E6F'],
            cells: {
                textAlign: 'center',
                border: 'none'
                // borderWidth: '0.5px',
                // borderStyle: 'solid',
                // borderColor: '#6589BB'
            }
        }
    }
};

module.exports = blue;