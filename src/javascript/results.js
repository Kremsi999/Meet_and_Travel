

function x(br){
    button=window.event.target;
    parent=button.parentElement;
    forma=parent.getElementsByTagName('form')[0];

    let f=document.getElementById("forma"+br);
    
    p=f[0].value;
    g=f[0].defaultValue;
    ff=new FormData(f);
}

//This functions creates elements that are common for all creations
//return - a JSON object that contains all the common elements that a specificCreate function will use to append specific elements 
function commonCreate(){
    //the row of the page container
    divPageRow=document.getElementsByClassName('row')[0];
    
    //one specific container
    divContainer=document.createElement('div');
    divContainer.classList.add(...['col-11', 'col-md-5', 'order-1', 'result-container'])
    
    //row for the specific container - the specific class (trip/group/wish...) will have to be added by the specificCreate function
    divContainerRow=document.createElement('div');
    divContainerRow.classList.add('row');
    
    //the div that will contain the image
    div1=document.createElement('div');
    div1.classList.add('col-3');

    //the div that will contain the body
    div2=document.createElement('div');
    div2.classList.add('col-6');

    //the div that will contain the buttons and the hidden form
    div3=document.createElement('div');
    div3.classList.add('col-3');

    return {'divPageRow':divPageRow,
            'divContainer':divContainer,
            'divContainerRow':divContainerRow,
            'div1':div1,
            'div2':div2,
            'div3':div3
        };
    
}
//the argument to the function is an object returned by commonCreate() after specificCreate appended specific elements
//this functions adds the object to the page 
function addToPage(commonCreateObj){
    commonCreateObj['divContainerRow'].appendChild(commonCreateObj['div1']);
    commonCreateObj['divContainerRow'].appendChild(commonCreateObj['div2']);
    commonCreateObj['divContainerRow'].appendChild(commonCreateObj['div3']);
    commonCreateObj['divContainer'].appendChild(commonCreateObj['divContainerRow']);
    commonCreateObj['divPageRow'].appendChild(commonCreateObj['divContainer']);
}


{/* <div class="col-11 col-md-5 order-1 result-container">
                        <div class="row trip">
                            <div class="col-3">
                                <img class="slika" src="php/images/1620843858relayfinal.png">
                            </div>
                            <div class="col-6">
                                    <p>Belgrade</p>
                                    <p> 12/6/2021</p>
                                    <p> 20/6/2021</p>
                                    <p>Budget: $500</p>
                                    <p>members: 4</p>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-success" onclick="x(1)">Request</button>
                                    <form action="#" id="forma1">
                                        <input type="text" name="outgoing_id" value="16"hidden>
                                        
                                        <!-- ovo treba da bude groupID -->
                                        <input type="text" name="incoming_id" value="121"hidden>
                            
                        
                                    </form>
                            </div>
                        </div>
                    </div> */}

//this is a specific create for a Group that is returned by the matching engine

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create_ResName_JSON IS THE ONLY THIS THAT HAS TO BE CREATED FOR EACH NEW RESULT REPRESENTATION AND TO ADD A CASE IN THE SWITCH STATEMENT!

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//creates the JSON object that is used to create specific elements for the Group
function createGroupJSON(image,where,from,to,budget,members,groupid,userid){
return {
'class':'trip',
'image':image,
'p':[where,from,to,"budget: $"+budget,"members: "+members],
'button':[{
    'class':['btn','btn-success'],
    'onclick':'x()',//function for the onclick event
    'text':'Request'
}],//end button
'input':[groupid,userid]
};
}

//JSON object that's received from the server 
/*
{
    class:Group or Arrangement or Wish or.......
    data: {
        budget:...
        where:...
        userid:...,
        groupid:...,
        .......
    }
}

*/
testData={
    'class':'group',
    'data':{
        'image':'php/images/1620843858relayfinal.png',
        'where':'Malta',
        'from':'13/07/2021',
        'to':'13/08/2021',
        'budget':999,
        'members':17,
        'groupid':69,
        'userid':92
    }
}

//Depending on the 'class' of the JSON object that's received from the server does the specific append
function polymorphicAppend(obj){
    obj=testData;
    switch(obj['class']){
        case "group":
            appendElement(createGroupJSON(obj.data['image'],obj.data['where'],obj.data['from'],obj.data['to'],obj.data['budget'],obj.data['members'],obj.data['groupid'],obj.data['userid']
            ));

            break;
    }

}

//obj is the JSON representation of the element that's being created
function appendElement(obj){

    commonCreateObj=commonCreate();

    //specific class for the divContainerRow
    commonCreateObj['divContainerRow'].classList.add(obj['class']);
    
    img=document.createElement('img');
    img.classList.add('slika');
    img.src=obj['image'];

    commonCreateObj['div1'].appendChild(img);

    obj['p'].forEach(data => {
        p=document.createElement('p');
        p.innerHTML=data;
        commonCreateObj['div2'].appendChild(p);
    });
    obj['button'].forEach(b=>{
        //button 
    button=document.createElement('button');
    button.classList.add(...b['class']);
    //button.onclick=x;//= ////////////////////////
    button.setAttribute('onclick',b['onclick']);
    button.innerHTML=b['text'];
    commonCreateObj['div3'].appendChild(button);
    });


    //form
    forma=document.createElement('form');
    
    obj['input'].forEach(data=>{
        input=document.createElement('input');
        input.setAttribute("type",'hidden');
        input.setAttribute('value',data);
        forma.appendChild(input);
    });
    

    commonCreateObj['div3'].appendChild(forma);

    //done with specific creation

    addToPage(commonCreateObj);
}