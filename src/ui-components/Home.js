import React, { useState } from 'react';
import repository from '../repository';
import Toolbar from './Toolbar';
import css from './home.module.css';
import Card from './Card';
import router from './router';

// hooks 記法
const Home = () => {

  const [list, setList] = useState(repository.getList({level: 0}));
  const [id, setId] = useState(2);

  const add = () => {
    console.log('[Home] add');
    repository.save({
      name: 'New Map',
      level: 0,
      parentId: null,
    });
    setList(repository.getList({level: 0}));
  };

  const actionMenu = [
    { name: 'add', onClick: () => add(), },
    { name: 'delete', onClick: () => deleteData(id), },
  ];

  const setSelected = (id) => {
    console.log('[Home] setSelected');
    setId(id);
  };

  const deleteData = (id) => {
    console.log('[Home] deleteData');
    repository.delete(id);
    setList(repository.getList({level: 0}));
  };

  const getMap = (id) => {
    console.log('[Home] getMap');
    router.setRoute('map', id);
  };

    return (
      <>
        <h1>Home</h1>
        <Toolbar list={actionMenu} type="alert" location={['vertical', 'right', 'bottom']} />
        <div className={css.list}>
          {
            list.map(item => (
              <div className={css.item}
                onDoubleClick={() => getMap(item.id)}
                key={item.id}>
                <Card id={item.id}
                  onClick={() => setSelected(item.id)}
                  isSelected={item.id === id}
                  name={item.name} comment={item.comment} />
              </div>
            ))
          }
        </div>
      </>

    );
};

export default Home;

// class 記法
// class Home extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       list: repository.getList({level: 0}),
//       id: 2
//     }
//   }

//   add() {
//     repository.save({
//       name: 'Bright Idea!',
//       level: 0,
//       parentId: null,
//     });
//     this.setState({list: repository.getList({level: 0})});
//   }

//   actionMenu = [
//     { name: 'add', onClick: () => this.add(), },
//     { name: 'delete', onClick: () => this.delete(this.state.id), },
//   ];

//   setSelected(id) {
//     this.setState({id});
//   }

//   delete(id) {
//     repository.delete(id);
//     this.setState({list: repository.getList({level: 0})});
//   }

//   getMap(id) {
//     router.setRoute('map', id);
//   }

//   render() {
//     return (
//       <>
//         <h1>Home</h1>
//         <Toolbar list={this.actionMenu} type="alert" location={['vertical', 'right', 'bottom']} />
//         <div className={css.list}>
//           {
//             this.state.list.map(item => (
//               <div className={css.item}
//                 onDoubleClick={() => this.getMap(item.id)}
//                 key={item.id}>
//                 <Card id={item.id}
//                   onClick={() => this.setSelected(item.id)}
//                   isSelected={item.id === this.state.id}
//                   name={item.name} comment={item.comment} />
//               </div>
//             ))
//           }
//         </div>
//       </>

//     );

//   }
// };

// export default Home;
