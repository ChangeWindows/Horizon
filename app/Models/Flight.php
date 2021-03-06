<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    public $searchableType = 'Flights';

    protected $table = 'flights';
    protected $fillable = ['major', 'minor', 'build', 'delta', 'release_channel_id'];
    protected $appends = ['edit_url', 'version', 'flight', 'url'];
    
    public function timeline() {
        return $this->morphOne(Timeline::class, 'item');
    }

    public function releaseChannel() {
        return $this->belongsTo(ReleaseChannel::class);
    }

    public function getReleaseAttribute() {
        return $this->releaseChannel->release;
    }

    public function getPlatformAttribute() {
        return $this->releaseChannel->release->platform;
    }

    public function getFlightAttribute() {
        return $this->build.'.'.$this->delta;
    }

    public function getVersionAttribute() {
        return $this->major.'.'.$this->minor.'.'.$this->build.'.'.$this->delta;
    }

    public function getUrlAttribute() {
        if ($this->release->package) {
            return route('front.platforms.packages', ['release' => $this->release, 'platform' => $this->release->platform], false);
        }

        return route('front.platforms.releases', ['release' => $this->release, 'platform' => $this->release->platform], false);
    }

    public function getEditUrlAttribute() {
        return route('admin.flights.edit', $this, false);
    }
}
