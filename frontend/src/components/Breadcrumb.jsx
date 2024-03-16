import { FaCircleChevronRight } from "react-icons/fa6";

const Breadcrumb = ({ menu, submenu }) => {
  return (
    <p className="font-light text-2xl text-p-dark p-4 md:px-8"> {menu}<FaCircleChevronRight className="inline text-xs mx-3 relative bottom-0.5"/><span className='font-bold'>{submenu}</span></p>
  )
}

export default Breadcrumb
