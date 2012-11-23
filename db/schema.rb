# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120919225024) do

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "email"
    t.string   "encrypted_password"
    t.string   "salt"
    t.boolean  "is_admin"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "folders", :force => true do |t|
    t.string "name"
    t.integer "parent_id"
    t.integer "user_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    
  end
  
  create_table "tours", :force => true do |t|
    t.string "name"
    t.integer "user_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false    
  end
  
  
  create_table "sites", :force => true do |t|
    t.float    "longitude"
    t.float    "latitude"
    t.integer "tour_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end
  
  create_table "photos", :force => true do |t|
    t.integer  "folder_id"        
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end
  create_table "sources", :force => true do |t|
    t.integer  "site_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end
  
  create_table "descriptions", :force => true do |t|
    t.integer  "source_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end


end
