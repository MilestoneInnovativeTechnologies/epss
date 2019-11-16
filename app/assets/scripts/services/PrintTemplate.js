export class PrintTemplate {

    constructor(width){
        this.width = width || 48;
        this.size = { 48:[48,24,16,12,9,8,7],32:[32,16,10,8,6,5,4] };
        this.print_lines = {};
        this.set_defaults()
    }

    set(obj){
        for(let x in obj) this[x] = obj[x];
    }

    company(obj){
        if(typeof obj === 'object') for(let x in obj) this.print_lines[x] = obj[x];
    }

    set_defaults(){
        this.defaults = {
            NORMAL: { source:null, title:null, detail:null, title_bold:false, detail_bold:true, separate_character:':', size:0, title_underline:false, detail_underline:false, line_feed:false, on:true },
            WIDE: { source:null, title:null, detail:null, title_bold:false, detail_bold:true, separate:false, separate_character:':', separate_position:'center', title_left:true, size:0, on:true },
            STACK: { source:null, title:null, detail:null, title_bold:true, detail_bold:false, size:0, title_size:0, detail_size:0, line_feed:false, title_append:'', align:'left', on:true },
            RAW: { source:null, detail:null, bold:false, size:0, align:'left', underline:false, line_feed:false, on:true },
            LINE: { text:'-', bold:false, size:0, on:true },
            FEED: { amount:1, on:true },
            TABLE: { source:null, columns:['No'], keys:['[AI]'], width:[1], size:0, on:true },
        };
    }

    NORMAL(options,object){
        let opts = this.options('NORMAL',options);
        let { source,title,detail,size,title_bold,detail_bold,title_underline,detail_underline,separate_character,line_feed,on } = opts;
        source = _.bind(this.sourceToTitleDetail,object,this.print_lines,on)(source,title,detail); if(!source) return [];
        let line_width = this.size[this.width][size];
        let bold_on = printer.BOLDON(), bold_off = printer.BOLDOFF(), underline_on = printer.UNDERLINEON(), underline_off = printer.UNDERLINEOFF(), lf1 = printer.LF(1);
        let separator = ` ${separate_character} `;
        let title_prepend = [].concat(title_bold ? bold_on : bold_off,title_underline ? underline_on : underline_off);
        let title_append = [].concat(title_underline ? underline_off : [],title_bold ? bold_off : []);
        let detail_prepend = [].concat(detail_bold ? bold_on : bold_off,detail_underline ? underline_on : underline_off);
        let detail_append = [].concat(detail_underline ? underline_off : [],detail_bold ? bold_off : [],line_feed ? lf1 : []);
        let lines = [].concat(size ? printer.SIZEON(size) : []), lastSourceIdx = source.length - 1;
        source.forEach(({ title,detail,print },sIdx) => {
            if(!print) return;
            title = title + separator;
            if((title + detail).length <= line_width) lines.push([].concat(title_prepend,printer.TEXT(title),title_append,detail_prepend,printer.TEXT(detail),detail_append));
            else {
                let available = line_width - title.length;
                let detailChunks = this.getChunks(detail,available);
                detailChunks.forEach((detail,line) => {
                    if(line !== 0){
                        detail = ' '.repeat(title.length) + detail;
                        lines.push([].concat(lf1,detail_prepend,printer.TEXT(detail),detail_append));
                    } else lines.push([].concat(title_prepend,printer.TEXT(title),title_append,detail_prepend,printer.TEXT(detail),detail_append));
                });
            }
            if(sIdx !== lastSourceIdx) lines.push(lf1);
        });
        return lines.concat(size ? printer.SIZEOFF() : [],lf1).flat(1);
    }

    WIDE(options,object){
        let opts = this.options('WIDE',options);
        let { source,title,detail,separate,separate_character,size,title_left,separate_position,title_bold,detail_bold,on } = opts;
        let sep = separate ? (` ${separate_character} `) : ' ';
        source = _.bind(this.sourceToTitleDetail,object,this.print_lines,on)(source,title,detail); if(!source) return [];
        let line_width = this.size[this.width][size];
        let lines = source.map(({ title,detail,print }) => print ? this.wideLineLeftRight(title_left ? title : detail,title_left ? detail : title,sep,separate ? separate_position : 'left',line_width) : { left:null,right:null });
        lines = this.wideLineNormalize(lines,line_width);
        let bold_on = printer.BOLDON(), bold_off = printer.BOLDOFF(), bold_left = bold_off, bold_right = bold_off;
        if(title_bold) if(title_left) bold_left = bold_on; else bold_right = bold_on;
        if(detail_bold) if(title_left) bold_right = bold_on; else bold_left = bold_on;
        let lineCodes = lines.map(({ left,right },idx) => (idx ? printer.LF(1) : []).concat(bold_left).concat(printer.TEXT(left)).concat(bold_right).concat(printer.TEXT(right))).concat(printer.BOLDOFF());
        if(size) lineCodes = printer.SIZEON(size).concat(lineCodes).concat(printer.SIZEOFF());
        return lineCodes.flat(1).concat(printer.LF(1));
    }

    STACK(options,object){
        let opts = this.options('STACK',options);
        let { source,title,detail,align,title_append,title_bold,detail_bold,title_size,detail_size,size,line_feed,on } = opts;
        source = _.bind(this.sourceToTitleDetail,object,this.print_lines,on)(source,title,detail); if(!source) return [];
        let bold_on = printer.BOLDON(), bold_off = printer.BOLDOFF(), lf1 = printer.LF(1), size_off = printer.SIZEOFF();
        title_size = (title_size||size||0) > 0 ? printer.SIZEON(title_size||size||0) : size_off;
        let title_prepend = [].concat((title_bold) ? bold_on : bold_off,title_size);
        title_append = [].concat(printer.TEXT(title_append),size_off,bold_on);
        detail_size = (detail_size||size||0) > 0 ? printer.SIZEON(detail_size||size||0) : size_off;
        let detail_prepend = [].concat((detail_bold) ? bold_on : bold_off,detail_size);
        let detail_append = [].concat(size_off,bold_off,(line_feed) ? lf1 : []);
        let lines = printer.ALIGN(printer.ALIGNMODE[align.toUpperCase()]);
        source.forEach(({ title,detail,print }) => {
            if(!print) return;
            title = [].concat(title_prepend,printer.TEXT(title),title_append,lf1);
            detail = [].concat(detail_prepend,printer.TEXT(detail),detail_append,lf1);
            lines.push(title,detail);
        });
        return lines.concat(printer.ALIGN(0)).flat(1);
    }

    RAW(options,object){
        let opts = this.options('RAW',options);
        let { source,detail,align,size,bold,underline,line_feed,on } = opts;
        source = _.bind(this.sourceToTitleDetail,object,this.print_lines,on)(source,null,detail); if(!source) return [];
        let size_off = printer.SIZEOFF(), bold_on = printer.BOLDON(), bold_off = printer.BOLDOFF(), underline_on = printer.UNDERLINEON(2), underline_off = printer.UNDERLINEOFF(), lf1 = printer.LF();
        let prepend = [].concat(bold ? bold_on : [],underline ? underline_on : []);
        let append = [].concat(bold ? bold_off : [],underline ? underline_off : [],line_feed ? lf1 : []);
        let lines = [].concat(printer.ALIGN(printer.ALIGNMODE[align.toUpperCase()]),(size > 0) ? printer.SIZEON(size) : size_off);
        source.forEach(({ detail,print }) => print ? lines.push([].concat(prepend,printer.TEXT(detail),append,lf1)) : null);
        return lines.concat(size_off,printer.ALIGN(0)).flat(1);
    }

    LINE(options,object){
        let opts = this.options('LINE',options);
        let { text,bold,size,on } = opts, chars = this.size[this.width][size];
        if(!_.bind(function(company,exp){ return eval(exp) },object,this.print_lines)(on)) return [];
        text = text.repeat(chars).substr(0,chars);
        return [].concat(
            bold ? printer.BOLDON() : printer.BOLDOFF(),
            size ? printer.SIZEON(size) : printer.SIZEOFF(),
            printer.TEXT(text),
            printer.SIZEOFF(),
            printer.BOLDOFF(),
            printer.LF())
    }

    FEED(options,object){
        let { amount,on } = this.options('FEED',options);
        if(!_.bind(function(company,exp){ return eval(exp) },object,this.print_lines)(on)) return [];
        return Array(amount).fill(10);
    }

    TABLE(options,object){
        let opts = this.options('TABLE',options);
        let { source,columns,keys,width,size,on } = opts;
        if(!_.bind(function(company,exp){ return eval(exp) },object,this.print_lines)(on)) return [];
        if(!Array.isArray(source)){
            if(typeof source === 'object') source = [source];
            else if(typeof source === 'string'){
                let exp = getExpression(source);
                if(!exp) source = [{}];
                else source = _.bind(function(exp){ return eval(exp) },object)(exp);
            } else source = [{}];
        }
        width = Object.assign([],Array(columns.length).fill(1),width).map(Num => parseInt(Num));
        let total = width.reduce((a, b) => a + b, 0);
        let page_width = this.size[this.width][size];
        let column_length = width.map(Num => Math.ceil(Num/total*page_width));
        column_length[column_length.length-1] = page_width - column_length.slice(0,column_length.length-1).reduce((a, b) => a + b, 0);
        columns = columns.map((col,idx) => this.toLength(col,column_length[idx],'R',' ',true));

        let rows = _.bind(this.tableRows,object,this.print_lines)(source,keys);
        let normalized = this.tableRowsNormalize(rows,column_length);

        return [].concat(
            this.LINE({ bold:true }),
            printer.TEXT(columns.join('') + "\n"),
            this.LINE(),
            printer.TEXT(normalized.join('')),
            this.LINE({ bold:true })
        )
    }

    wideLineLeftRight(left,right,sep,sep_pos,width){
        switch (sep_pos) {
            case 'center': {
                let middle_space = sep.length, left_space = Math.floor(width/2) - middle_space, right_space = width - left_space - middle_space;
                left = this.toLength(left,left_space,'R',' ') + sep;
                right = this.toLength(right,right_space,'L',' ');
            }
            break;
            case 'left': {
                left = left + sep;
                right = this.toLength(right,width-left.length,'L',' ');
            }
            break;
            case 'right': {
                right = this.toLength(sep + right,width-left.length,'L',' ');
            }
            break;
        }
        return { left,right };
    }

    wideLineNormalize(lines,width){
        let normalized = [];
        lines.forEach(({ left,right }) => {
            if(!left && !right) return;
            if(left.length + right.length > width){
                if(left.length > Math.ceil(width/3)){
                    let leftLength = Math.floor(width/2), rightLength = width - leftLength;
                    let leftArray = this.getChunks(left,leftLength);
                    let rightArray = this.getChunks(right,rightLength);
                    let maxLoop = Math.max(leftArray.length,rightArray.length);
                    for(let i = 0; i<maxLoop; i++){
                        let leftStr = this.toLength(leftArray[i] || '',leftLength);
                        let rightStr = this.toLength(rightArray[i] || '',rightLength,'L');
                        normalized.push({ left:leftStr,right:rightStr })
                    }
                } else {
                    let leftLength = left.length, leftSpace = " ".repeat(leftLength);
                    let rightArray = this.getChunks(right,width-leftLength);
                    rightArray.forEach((right,idx) => idx ? normalized.push({ left:leftSpace,right }) : normalized.push({ left,right }))
                }
            } else normalized.push({ left,right });
        });
        return normalized;
    }

    tableRows(company,source,keys){
        let rows = [];
        source.forEach((data,idx) => {
            let AI = idx+1, row = [];
            keys.forEach(key => {
                let exp = getExpression(key), rowData = eval(exp || 'data[key]');
                if(rowData === null || rowData === undefined) rowData = '';
                row.push(rowData.toString())
            });
            rows.push(row);
        });
        return rows;
    }

    tableRowsNormalize(rows,column_length){
        let normalized = [], lastRowIdx = rows.length-1;

        rows.forEach((cols,rowIdx) => {
            let lineItems = [], lines = 1;
            cols.forEach((col,pos) => {
                if(col.length < column_length[pos]) lineItems.push([col]);
                else {
                    let colChunks = this.getChunks(col,column_length[pos]-1);
                    lineItems.push(colChunks);
                    if(colChunks.length > lines) lines = colChunks.length;
                }
            });

            let filled_columns = [];
            lineItems.forEach((lineItem,col) => {
                let line_content = [];
                for(let i = 0; i < lines; i++) line_content.push(this.toLength(lineItem[i]||'',column_length[col]));
                filled_columns.push(line_content);
            });

            for(let j = 0; j < lines; j++){
                filled_columns.forEach(column => normalized.push(column[j]));
                normalized.push("\n");
            }

            if(lastRowIdx !== rowIdx) normalized.push("\n");
        });

        return normalized;
    }

    options(item,options){
        return Object.assign({},this.defaults[item],options || {})
    }

    sourceToTitleDetail(company,on,source,title,detail){
        if(!source){
            source = [{ title:null,detail:null }];
            title_exp = getExpression(title); detail_exp = getExpression(detail);
            source[0]['title'] = (title_exp) ? eval(title_exp) : title;
            source[0]['detail'] = (detail_exp) ? eval(detail_exp) : detail;
            title = 'title'; detail = 'detail';
        } else if(typeof source === 'string') {
            let source_exp = getExpression(source);
            source = source_exp ? eval(source_exp) : [{ title:null,detail:null }];
        }
        if(!Array.isArray(source)) source = [source];
        let title_exp = getExpression(title), detail_exp = getExpression(detail);
        return source.map((data,index) => new Object({ title:title_exp ? eval(title_exp) : data[title],detail:detail_exp ? eval(detail_exp) : data[detail], print:eval(on) }));
    }

    toLength(str,len,pos = 'R',chr = " ",strict = false){
        if(typeof str !== 'number' && typeof str !== 'string') str = '';
        let repeat = parseInt(len) - str.toString().length;
        chr = chr.repeat(repeat>0 ? repeat : 0);
        str = pos === 'R' ?  str + chr : chr + str;
        if(strict) return pos === 'R' ? str.substr(0,len) : str.substr(str.length - len);
        return str;
    }

    getChunks(str,len){
        if(str === null || str === undefined) return [];
        let chunks = []; len = len || 1; str = str.toString();
        for(let i = 0;i < str.length;i += len){
            chunks.push(str.substr(i,len))
        }
        return chunks;
    }
}

function getExpression(str){
    return (!str || typeof str !== 'string' || str.substr(0,1) !== '[' || str.substr(-1) !== ']') ? null : str.substring(1,str.length-1);
}
