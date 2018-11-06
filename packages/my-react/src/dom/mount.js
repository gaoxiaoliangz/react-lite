import { getElementFlag } from "../element";




const mount = element => {

  const flag = getElementFlag(element)

  switch (flag) {
    case 'class':
      
      break;

    case 'func':

    case 'dom':

    case 'text':
  
    default:
      break;
  }


}

export default mount
