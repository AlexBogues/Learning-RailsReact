module Api
  class PlansController < ApplicationController
    def index
      plans = Plan.select(:id, :code, :name, :description).order(:id)
      render json: plans
    end
  end
end

