import { Point, Curve, CurveL, CurveQ } from "./curve"

export function pathToCharaterWithCurve(path: string):Array<Curve> {
    function paramsStrToParamsList(paramsStr:string):Array<number>{
        let paramsList:Array<number>=[]
        for(let i of paramsStr.trim().split(/[,\s]+|(?<=\d)(?=-)/)){
            paramsList.push(Number(i))
        }
        return paramsList
    }
    let headPoint:Point=null
    let nowPoint:Point=new Point(0,0)
    let characterWithCurve:Array<Curve>=[]
    let first = path.trim().split(/(?<=\d)\s*(?=[A-Za-z])/)
    for(let i of first){
        let paramsList:number[]
        let split:string[] = i.split(/(?<=[A-Za-z])/)
        let typeName:string=split[0]
        let paramsStr:string=split[1]
        if(paramsStr){
            paramsList=paramsStrToParamsList(paramsStr)
        }
        let end:Point
        switch (typeName.toLowerCase()) {
            case 'm':
                end=new Point(paramsList[0],paramsList[1])
                if(typeName=='m'){
                    end.offset(nowPoint.x,nowPoint.y)
                }
                headPoint=end
                nowPoint=end
                break;
            case 'l':
                end=new Point(paramsList[0],paramsList[1])
                if(typeName=='l'){
                    end.offset(nowPoint.x,nowPoint.y)
                }
                if(end.isSamePosition(headPoint)){
                    end=headPoint
                    headPoint=null
                }
                characterWithCurve.push(new CurveL(nowPoint, end))
                nowPoint=end
                break
            case 'h':
                end=new Point(paramsList[0],paramsList[1])
                if(typeName=='h'){
                    end.offset(nowPoint.x,0)
                }
                if(end.isSamePosition(headPoint)){
                    end=headPoint
                    headPoint=null
                }
                characterWithCurve.push(new CurveL(nowPoint,end))
                nowPoint=end
                break
            case 'v':
                end=new Point(nowPoint.x,paramsList[0])
                if(typeName=='v'){
                    end.offset(0,nowPoint.y)
                }
                if(end.isSamePosition(headPoint)){
                    end=headPoint
                    headPoint=null
                }
                characterWithCurve.push(new CurveL(nowPoint,end))
                nowPoint=end
                break
            case 'q':
                end= new Point(paramsList[0],paramsList[1])
                let control:Point=new Point(paramsList[2],paramsList[3])
                if(typeName=='q'){
                    end.offset(nowPoint.x,nowPoint.y)
                    control.offset(nowPoint.x,nowPoint.y)
                }
                if(end.isSamePosition(headPoint)){
                    end=headPoint
                    headPoint=null
                }
                characterWithCurve.push(new CurveQ(nowPoint,end,control))
                nowPoint=end
                break
            case 't':
                break
            case 'c':
                break
            case 's':
                break
            case 'a':
                break
            case 'z':
                if(headPoint!=null){
                    if(!headPoint.isSamePosition(nowPoint)){
                        characterWithCurve.push(new CurveL(nowPoint,headPoint))
                    }
                    nowPoint=headPoint
                }
                break
            default:
                throw "not supported svg command found"
        }
    }
    return characterWithCurve
}