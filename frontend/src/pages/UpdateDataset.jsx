import React from 'react'
import { Breadcrumb } from '../components'

const UpdateDataset = ({ title, subtitle }) => {
  return (
    <>
      <div className="w-full">
        <Breadcrumb menu={title} submenu={subtitle} />
        <div className="px-4 md:px-8">
          <div className="bg-p-light rounded-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>01</div>
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Upload Dataset</span>
                  <span className="label-text-alt">(.xlsx)</span>
                </div>
                <input type="file" className="file-input file-input-bordered w-full" />
              </label>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateDataset
