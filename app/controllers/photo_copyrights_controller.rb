class PhotoCopyrightsController < ApplicationController
  before_filter :signed_in_user

  def update_default_copyright
    params[:notice] = params[:notice].gsub(/#copy#/,"&copy;").gsub(/#nbsp#/,"&nbsp;").gsub(/#and#/,"&")
    PhotoCopyright.first.update_attributes(
      notice:params[:notice],
      opacity:params[:opacity].to_f,
      left_offset:params[:leftOffset].to_f,
      top_offset:params[:topOffset].to_f,
      color:params[:color],
      size:params[:size].to_f
    )

    respond_to do |format|
      format.json { head :ok }
    end
  end

  def destroy
    photo_copyright = PhotoCopyright.find(params[:id])
    photo_copyright.delete
  end
end
