json.user do
  json.id @user.id
  json.full_name @user.full_name
  json.bio @user.bio
  json.avatar_url asset_path(@user.avatar.url)
  json.articles @articles.pluck(:id) if @articles
  json.created_at @user.created_at
  json.following current_user.subscriptions.include?(@user) if logged_in?
  json.subscriber_count @user.subscribers.count
  json.subscription_count @user.subscriptions.count
  if @user == current_user
    json.email @user.email
  end

end

if @articles
  json.articles do
    @articles.map do |article|
      json.set! article.id do
        json.extract! article,
        :id,
        :author_id,
        :title,
        :publish_date,
        :header_image_url,
        :comments_count,
        :lead_text
        json.liked current_user.liked_articles.include?(article) if logged_in?
        json.like_count article.likes.count
      end
    end
  end
end
