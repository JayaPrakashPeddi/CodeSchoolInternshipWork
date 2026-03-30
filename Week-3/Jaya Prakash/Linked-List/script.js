class Node{
    constructor(data){
        this.data=data;
        this.next=null;
    }
}

class LinkedList{
    constructor(head,length){
        this.head=null;
        this.length=0;
    }

    nodeAppend(data){
        const newNode = new Node(data);
        if(!this.head){
            this.head=newNode;
        }
        else{
            let currentNode=this.head;

            while (currentNode.next!==null){
                currentNode=currentNode.next;
            }
            currentNode.next=newNode;

        }

        this.length++;
        console.log(`New Node Appended:${data}`)
    }

    nodePop(){
        console.log(`Node Poped:${this.head.data}`)
        this.head=this.head.next;
        this.length--;
    }

    nodeInsert(index, data){
        const newNode = new Node(data);
        if (index===0){
            newNode.next=this.head;
            this.head=newNode;
        }
        else{
            let currentNode=this.head;
            let position = 0;
            let previousNode=null;
            while (currentNode && position<index){
                previousNode = currentNode;
                currentNode = currentNode.next;
                position++;
            }
            previousNode.next=newNode;
            newNode.next=currentNode;
        }
        console.log(`Node Inserted:${data} at Index:${index}`)
        this.length++;
    }

    nodeRemove(data){
        if (this.head.data===data) this.head=this.head.next;
        else{
            let currentNode = this.head.next;
            let previousNode=this.head;
            while (currentNode.next){
                if (currentNode.data===data){
                    previousNode.next=currentNode.next;
                    console.log(`Node Removed:${data}`)
                    return;
                }
                previousNode=currentNode;
                currentNode=currentNode.next;
            }
            console.log("Node not Found!!")
        }
    }

    nodeDisplay(){
        let currentNode=this.head;
        let result = "head -> ";

        while (currentNode){
            result+=`${currentNode.data} -> `;
            currentNode=currentNode.next;
        }
        result+="Null";
        console.log(result);
    }
}

const LL = new LinkedList();

LL.nodeAppend(1);
LL.nodeAppend(2);
LL.nodeAppend(3);
LL.nodeAppend(4);
LL.nodeDisplay();

LL.nodePop();
LL.nodeDisplay();

LL.nodeInsert(2,9);
LL.nodeDisplay();

LL.nodeRemove(9);
LL.nodeDisplay();
