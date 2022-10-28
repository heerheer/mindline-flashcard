//源文件的数据映射
export interface MindLineProj {
  name: string
  raw: string
}

//MindLine内部的一个主题
export interface MindLineSubject {
  nodes: MindLineNode[],
  //主题的标题
  title: string
  //备注
  remark?: string
}

//转换为简单可识别结构后的Node
export interface MindLineNode {
  id: string;
  text: string;
  nodes: MindLineNode[],
  //标记
  markType?: string
  //备注
  remark?: string
}

//主题合集
export interface MindLineSubjectCollection {
  subjects: MindLineSubject[],
  name?: string,
}


export interface Card {
  //由Node本身的id转化而来的id
  cid: string;
  //选项，即存在的子条目
  options: CardOption[]
  //卡片本身的文本
  text: string;
  //
  remark?: string
  //
  parents: { text: string, cid: string }[]
}

export type CardOption = { text: string, cid?: string, remark: string }

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type MindLineNodeCard = Overwrite<MindLineNode, { nodes: MindLineNodeCard[] }> & {
  parents: string[],
}

