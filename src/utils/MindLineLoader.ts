import {Card, MindLineNode, MindLineSubject, MindLineSubjectCollection} from 'components/models';

async function LoadSubjectCollection(url: string) {
  const json = await (await fetch(url)).json()
  return turn2collection(json)
}

function GetNodesAsCard(subject: MindLineSubject) {
  const nodes: Card[] = []
  nodes.push(
    {
      cid: subject.title,
      text: subject.title,
      remark: subject.remark ?? '',
      options: subject.nodes.map(x => {
        return {text: x.text, cid: x.id, remark: ''}
      }),
      parents: []
    })

  subject.nodes.forEach(x => {
    nodes.push(...Node2Card(x, []))
  })
  return nodes;
}

//将一个Node以及他下面的Node转化为无二级children的Node
function Node2Card(node: MindLineNode, parents: { text: string, cid: string }[]): Card[] {
  const nodes: Card[] = []
  if (node.nodes.length > 0) {
    node.nodes.forEach(x => {
      nodes.push(...Node2Card(x, [...parents, {text: node.text, cid: node.id}]))
    })
  } else {
    if (node.remark == '') {
      return []
    }
  }
  nodes.push(
    {
      cid: node.id,
      text: node.text,
      remark: node.remark ?? '',
      options: node.nodes.map(x => {
        return {text: x.text, cid: x.id, remark: x.remark ?? ''}
      }),
      parents: parents
    })
  return nodes
}

//将raw节点转化为新type的节点。
function tranNode(node: any): MindLineNode {
  const m_node: MindLineNode = {
    nodes: [],
    text: node.text,
    id: node.ID,
    markType: node.markType,
    remark: node.remark ?? ''
  };
  if (node.children) {
    const childrens = util_obj2array(node.children);
    for (const children of childrens) {
      m_node.nodes.push(tranNode(children))
    }
  }

  return m_node
}

//将对象中"0" "1"等数字key转化成数组对象返回
const util_obj2array = (obj: any) => {
  const array = [];
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (!Number.isNaN(Number.parseFloat(key))) {
      array.push(obj[key])
    }
  }
  return array
}

//将mindline源文件转为简易识别类型
function turn2collection(raw: any): MindLineSubjectCollection {
  const collection: MindLineSubjectCollection = {
    subjects: []
  }

  //subject节点是其他主题
  const subjectList = [];
  if (raw.subjects) {
    subjectList.push(...util_obj2array(raw.subjects));
  }
  subjectList.push({root: raw.root})
  subjectList.forEach(subjectRaw => {
    const title = subjectRaw.root.text;


    const nodes = [];
    //children1 和 children2是左右分支，这里不需要区分
    let childrens = util_obj2array(subjectRaw.root.children)
    for (const children of childrens) {
      nodes.push(tranNode(children))
    }
    childrens = util_obj2array(subjectRaw.root.children2)
    for (const children of childrens) {
      nodes.push(tranNode(children))
    }

    collection.subjects.push({nodes, title})
  })
  //返回最后的主题合集
  return collection
}

export {LoadSubjectCollection, GetNodesAsCard}
