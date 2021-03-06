class SpeechStatsController < ApplicationController
	def index
		speech_stats = current_user.speech_stats.where("local_text_pace > 5").page(params[:page]).per(15).order(created_at: :desc)

    @speech_stat_dashboard_props = { 
      paces: serialize_speech_stats_pace(speech_stats),
      presentation_count: current_user.speech_stats.count,
      presentation_hours: 0,
      speech_stats: speech_stats,
      emotions: serialize_speech_stats_emotions(speech_stats),
      hesitations: serialize_speech_stats_hesitations(speech_stats),
      grade_scores: serialize_speech_stats_grade_scores(speech_stats)
    }
	end

	def show
		@speech_stat = SpeechStat.find(params[:id])

    @speech_stat_dashboard_show_props = {

    }
	end

  private

  def serialize_speech_stats_pace(speech_stats)
    speech_stats.map do |speech_stat|
      {
        pace: speech_stat.local_text_pace.round
      }
    end
  end

  def serialize_speech_stats_emotions(speech_stats)
    speech_stats.map do |speech_stat|
      {
        joy: (speech_stat.happy_facial_indico*100).round,
        sadness: (speech_stat.sad_facial_indico*100).round,
        anger: (speech_stat.angry_facial_indico*100).round,
        excitement: (speech_stat.surprise_facial_indico*100).round
      }
    end
  end

  def serialize_speech_stats_hesitations(speech_stats)
    speech_stats.map do |speech_stat|
      {
        hesitation: speech_stat.hesitation_count
      }
    end
  end

  def serialize_speech_stats_grade_scores(speech_stats)
    speech_stats.map do |speech_stat|
      {
        grade_score: speech_stat.grade_score.round
      }
    end
  end
end
