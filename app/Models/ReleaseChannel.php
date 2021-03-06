<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

class ReleaseChannel extends Model
{
    use HasFactory;
    use HasRelationships;

    protected $table = 'release_channels';
    protected $fillable = ['name', 'short_name', 'supported', 'channel_id', 'release_id'];
    protected $appends = ['edit_url'];

    protected $casts = [
        'supported' => 'integer'
    ];

    public function channel() {
        return $this->belongsTo(Channel::class);
    }

    public function release() {
        return $this->belongsTo(Release::class);
    }

    public function platform() {
        return $this->hasOneThrough(Platform::class, Channel::class);
    }

    public function flights() {
        return $this->hasMany(Flight::class);
    }

    public function timeline() {
        return $this->hasManyDeep(Timeline::class, [Flight::class], [null, ['item_type', 'item_id']]);
    }

    public function promotion() {
        return $this->hasOne(Promotion::class);
    }

    public function getLatestAttribute() {
        return Flight::where('release_channel_id', '=', $this->id)
            ->orderBy('build', 'desc')
            ->orderBy('delta', 'desc')
            ->first();
    }

    public function getEditUrlAttribute() {
        if ($this->release->package) {
            return route('admin.releasechannels.edit', ['release_channel' => $this, 'package' => true], false);
        } else {
            return route('admin.releasechannels.edit', $this, false);
        }
    }
}
